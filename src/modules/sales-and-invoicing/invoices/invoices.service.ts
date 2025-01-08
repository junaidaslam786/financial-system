import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
import { CreateInvoiceDto } from './dtos/create-invoice.dto';
import { UpdateInvoiceDto } from './dtos/update-invoice.dto';
import { Company } from 'src/modules/companies/entities/company.entity';
import { CustomerEntity } from 'src/modules/company-contacts/customers/entities/customer.entity';
import { BrokerEntity } from 'src/modules/company-contacts/brokers/entities/broker.entity';
import { ProductEntity } from 'src/modules/product-and-inventory/products/entities/product.entity';
import { JournalService } from 'src/modules/financial/journal/journal.service';
import { SalesOrderEntity } from 'src/modules/sales-and-invoicing/sales-orders/entities/sales-order.entity';
// If you want to link a sales order

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,

    @InjectRepository(InvoiceItem)
    private readonly invoiceItemRepo: Repository<InvoiceItem>,

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,

    @InjectRepository(CustomerEntity)
    private readonly customerRepo: Repository<CustomerEntity>,

    @InjectRepository(BrokerEntity)
    private readonly brokerRepo: Repository<BrokerEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,

    private readonly journalService: JournalService, // for auto-posting to ledger
  ) {}

  /**
   * Create a new invoice with items
   * and automatically create a balanced journal entry.
   */
  async create(dto: CreateInvoiceDto): Promise<Invoice> {
    // 1) Validate references
    const company = await this.validateCompany(dto.companyId);

    let customer: CustomerEntity | null = null;
    if (dto.customerId) {
      customer = await this.validateCustomer(dto.customerId);
    }

    let broker: BrokerEntity | null = null;
    if (dto.brokerId) {
      broker = await this.validateBroker(dto.brokerId);
    }

    // 2) Build the invoice
    const invoice = this.invoiceRepo.create({
      company,
      customer,
      broker,
      invoiceNumber: dto.invoiceNumber,
      invoiceDate: dto.invoiceDate ? new Date(dto.invoiceDate) : new Date(),
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      termsAndConditions: dto.termsAndConditions,
      notes: dto.notes,
      status: 'Unpaid',
    });

    // If your DB has a `salesOrderId` column, do:
    if (dto.salesOrderId) {
      invoice.salesOrder = { id: dto.salesOrderId } as SalesOrderEntity;
    }

    // 3) Build items
    const items = await Promise.all(
      dto.items.map(async (itemDto) => {
        const product = await this.validateProduct(itemDto.productId);
        const base =
          itemDto.quantity * itemDto.unitPrice - (itemDto.discount || 0);
        const totalLine = base + (base * (itemDto.taxRate || 0)) / 100;

        return this.invoiceItemRepo.create({
          product,
          description: itemDto.description,
          quantity: itemDto.quantity,
          unitPrice: itemDto.unitPrice,
          discount: itemDto.discount || 0,
          taxRate: itemDto.taxRate || 0,
          totalPrice: totalLine,
        });
      }),
    );

    invoice.items = items;
    invoice.totalAmount = items.reduce((sum, it) => sum + it.totalPrice, 0);

    // 4) Save invoice first (no journal link yet)
    const savedInvoice = await this.invoiceRepo.save(invoice);

    // 5) Create a balanced journal entry
    const journal = await this.createSalesInvoiceJournal(savedInvoice);

    // 6) Link invoice -> journal
    savedInvoice.journalEntry = journal;
    await this.invoiceRepo.save(savedInvoice);

    return savedInvoice;
  }

  /**
   * Get all invoices for a specific company
   */
  async findAll(companyId: string): Promise<Invoice[]> {
    if (!companyId) {
      throw new BadRequestException('companyId is required.');
    }

    return this.invoiceRepo.find({
      where: { company: { id: companyId } },
      relations: [
        'items',
        'customer',
        'broker',
        'items.product',
        'company',
        'salesOrder',
        'journalEntry',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get a specific invoice by ID
   */
  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoiceRepo.findOne({
      where: { id },
      relations: [
        'items',
        'customer',
        'broker',
        'items.product',
        'company',
        'salesOrder',
        'journalEntry',
      ],
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID "${id}" not found.`);
    }
    return invoice;
  }

  /**
   * Update an existing invoice
   */
  async update(id: string, dto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.findOne(id);

    if (dto.customerId !== undefined) {
      invoice.customer = dto.customerId
        ? await this.validateCustomer(dto.customerId)
        : null;
    }

    if (dto.brokerId !== undefined) {
      invoice.broker = dto.brokerId
        ? await this.validateBroker(dto.brokerId)
        : null;
    }

    if (dto.invoiceDate) {
      invoice.invoiceDate = new Date(dto.invoiceDate);
    }
    if (dto.dueDate !== undefined) {
      invoice.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    }
    if (dto.termsAndConditions !== undefined) {
      invoice.termsAndConditions = dto.termsAndConditions;
    }
    if (dto.notes !== undefined) {
      invoice.notes = dto.notes;
    }
    // if (dto.status !== undefined) {
    //   invoice.status = dto.status;
    // }

    // If we have updated items
    if (dto.items) {
      await this.invoiceItemRepo.remove(invoice.items);
      const newItems = await Promise.all(
        dto.items.map(async (iDto) => {
          const product = await this.validateProduct(iDto.productId);
          const base = iDto.quantity * iDto.unitPrice - (iDto.discount || 0);
          const totalLine = base + (base * (iDto.taxRate || 0)) / 100;
          return this.invoiceItemRepo.create({
            product,
            description: iDto.description,
            quantity: iDto.quantity,
            unitPrice: iDto.unitPrice,
            discount: iDto.discount || 0,
            taxRate: iDto.taxRate || 0,
            totalPrice: totalLine,
          });
        }),
      );
      invoice.items = newItems;
      invoice.totalAmount = newItems.reduce(
        (sum, it) => sum + it.totalPrice,
        0,
      );
    }

    // Possibly also re-link the invoice to a different sales order if needed
    if (dto.salesOrderId !== undefined) {
      invoice.salesOrder = dto.salesOrderId
        ? ({ id: dto.salesOrderId } as SalesOrderEntity)
        : undefined;
    }

    // Save changes
    const updatedInvoice = await this.invoiceRepo.save(invoice);

    // Optionally update or correct the existing journal entry
    // (We skip that here, but you might do so for accurate ledger)

    return updatedInvoice;
  }

  async remove(id: string): Promise<void> {
    const invoice = await this.findOne(id);
    // Possibly reverse the existing journal entry or do another approach
    await this.invoiceRepo.remove(invoice);
  }

  // ----------------------------
  // PRIVATE METHODS
  // ----------------------------
  private async validateCompany(companyId: string): Promise<Company> {
    const company = await this.companyRepo.findOne({
      where: { id: companyId },
    });
    if (!company) {
      throw new BadRequestException('Invalid companyId.');
    }
    return company;
  }

  private async validateCustomer(customerId: string): Promise<CustomerEntity> {
    const customer = await this.customerRepo.findOne({
      where: { id: customerId },
    });
    if (!customer) {
      throw new BadRequestException('Invalid customerId.');
    }
    return customer;
  }

  private async validateBroker(brokerId: string): Promise<BrokerEntity> {
    const broker = await this.brokerRepo.findOne({ where: { id: brokerId } });
    if (!broker) {
      throw new BadRequestException('Invalid brokerId.');
    }
    return broker;
  }

  private async validateProduct(productId: string): Promise<ProductEntity> {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new BadRequestException(`Invalid productId: ${productId}`);
    }
    return product;
  }

  /**
   * Creates a balanced journal entry for a sales invoice
   *  - Debit Accounts Receivable
   *  - Credit Sales Revenue
   */
  private async createSalesInvoiceJournal(inv: Invoice) {
    const company = inv.company;
    if (!company.defaultArAccountId || !company.defaultSalesAccountId) {
      throw new BadRequestException(
        'Company default AR or Sales account not set.',
      );
    }

    const lines = [
      {
        accountId: company.defaultArAccountId,
        debit: inv.totalAmount,
        credit: 0,
      },
      {
        accountId: company.defaultSalesAccountId,
        debit: 0,
        credit: inv.totalAmount,
      },
    ];

    const entry = await this.journalService.create({
      companyId: company.id,
      entryDate: inv.invoiceDate.toISOString(),
      reference: `Invoice #${inv.invoiceNumber}`,
      description: `Auto posted sales invoice ${inv.id}`,
      lines,
    });

    return entry;
  }
}
