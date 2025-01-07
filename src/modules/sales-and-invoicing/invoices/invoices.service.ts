import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dtos/create-invoice.dto';
import { UpdateInvoiceDto } from './dtos/update-invoice.dto';
import { InvoiceItem } from './entities/invoice-item.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import { CustomerEntity } from 'src/modules/company-contacts/customers/entities/customer.entity';
import { BrokerEntity } from 'src/modules/company-contacts/brokers/entities/broker.entity';
import { ProductEntity } from 'src/modules/product-and-inventory/products/entities/product.entity';

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
  ) {}

  /**
   * Create a new invoice with items
   */
  async create(dto: CreateInvoiceDto): Promise<Invoice> {
    // Validate company
    const company = await this.companyRepo.findOne({ where: { id: dto.companyId } });
    if (!company) {
      throw new BadRequestException('Invalid companyId.');
    }

    // Optional references
    let customer: CustomerEntity | null = null;
    if (dto.customerId) {
      customer = await this.customerRepo.findOne({ where: { id: dto.customerId } });
      if (!customer) {
        throw new BadRequestException('Invalid customerId.');
      }
    }

    let broker: BrokerEntity | null = null;
    if (dto.brokerId) {
      broker = await this.brokerRepo.findOne({ where: { id: dto.brokerId } });
      if (!broker) {
        throw new BadRequestException('Invalid brokerId.');
      }
    }

    // Build invoice
    const invoice = this.invoiceRepo.create({
      company,
      customer: customer || null,
      broker: broker || null,
      invoiceNumber: dto.invoiceNumber,
      invoiceDate: dto.invoiceDate ? new Date(dto.invoiceDate) : new Date(),
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      termsAndConditions: dto.termsAndConditions,
      notes: dto.notes,
      // items will be set below
    });

    // Build items
    const items = await Promise.all(
      dto.items.map(async (itemDto) => {
        // Optional product validation
        const product = await this.productRepo.findOne({ where: { id: itemDto.productId } });
        if (!product) {
          throw new BadRequestException(`Invalid productId: ${itemDto.productId}`);
        }

        const item = this.invoiceItemRepo.create({
          product,
          description: itemDto.description,
          quantity: itemDto.quantity,
          unitPrice: itemDto.unitPrice,
          discount: itemDto.discount || 0,
          taxRate: itemDto.taxRate || 0,
        });
        // Calculate total price
        item.totalPrice =
          item.quantity * item.unitPrice -
          item.discount +
          ((item.quantity * item.unitPrice - item.discount) * item.taxRate) / 100;

        return item;
      }),
    );

    // Assign items to invoice
    invoice.items = items;
    // Calculate total amount
    invoice.totalAmount = items.reduce((sum, it) => sum + it.totalPrice, 0);

    return this.invoiceRepo.save(invoice);
  }

  /**
   * Get all invoices for a specific company
   * If 'companyId' is mandatory, keep this required.
   * Otherwise, remove the filter or handle it conditionally.
   */
  async findAll(companyId: string): Promise<Invoice[]> {
    if (!companyId) {
      // or throw an error if it's required
      throw new BadRequestException('companyId is required.');
    }

    return this.invoiceRepo.find({
      where: { company: { id: companyId } },
      relations: ['items', 'customer', 'broker', 'items.product', 'company'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get a specific invoice by ID
   */
  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoiceRepo.findOne({
      where: { id },
      relations: ['items', 'customer', 'broker', 'items.product', 'company'],
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID "${id}" not found.`);
    }
    return invoice;
  }

  /**
   * Update an existing invoice
   * This implementation REPLACES items with the new ones (if dto.items is provided).
   */
  async update(id: string, dto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.findOne(id);

    // Update references
    if (dto.customerId !== undefined) {
      if (dto.customerId) {
        const customer = await this.customerRepo.findOne({ where: { id: dto.customerId } });
        if (!customer) {
          throw new BadRequestException('Invalid customerId.');
        }
        invoice.customer = customer;
      } else {
        invoice.customer = null;
      }
    }

    if (dto.brokerId !== undefined) {
      if (dto.brokerId) {
        const broker = await this.brokerRepo.findOne({ where: { id: dto.brokerId } });
        if (!broker) {
          throw new BadRequestException('Invalid brokerId.');
        }
        invoice.broker = broker;
      } else {
        invoice.broker = null;
      }
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

    if (dto.items) {
      // Remove old items & re-add
      await this.invoiceItemRepo.remove(invoice.items);
      const newItems: InvoiceItem[] = [];
      for (const itemDto of dto.items) {
        const product = await this.productRepo.findOne({ where: { id: itemDto.productId } });
        if (!product) {
          throw new BadRequestException(`Invalid productId: ${itemDto.productId}`);
        }

        const lineItem = this.invoiceItemRepo.create({
          product,
          description: itemDto.description,
          quantity: itemDto.quantity,
          unitPrice: itemDto.unitPrice,
          discount: itemDto.discount || 0,
          taxRate: itemDto.taxRate || 0,
        });
        lineItem.totalPrice =
          lineItem.quantity * lineItem.unitPrice -
          lineItem.discount +
          ((lineItem.quantity * lineItem.unitPrice - lineItem.discount) * lineItem.taxRate) / 100;
        newItems.push(lineItem);
      }
      invoice.items = newItems;
      invoice.totalAmount = newItems.reduce((sum, it) => sum + it.totalPrice, 0);
    }

    return this.invoiceRepo.save(invoice);
  }

  /**
   * Delete an invoice by ID
   */
  async remove(id: string): Promise<void> {
    const invoice = await this.findOne(id);
    await this.invoiceRepo.remove(invoice);
  }
}
