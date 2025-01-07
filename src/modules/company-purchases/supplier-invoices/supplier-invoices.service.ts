import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupplierInvoice } from './entities/supplier-invoice.entity';
import { SupplierInvoiceItem } from './entities/supplier-invoice-item.entity';
import { CreateSupplierInvoiceDto } from './dtos/create-supplier-invoice.dto';
import { UpdateSupplierInvoiceDto } from './dtos/update-supplier-invoice.dto';
import { CreateSupplierInvoiceItemDto } from './dtos/create-supplier-invoice-item.dto';
import { UpdateSupplierInvoiceItemDto } from './dtos/update-supplier-invoice-item.dto';
import { Company } from '../../companies/entities/company.entity';
import { SupplierEntity } from 'src/modules/company-contacts/suppliers/entities/supplier.entity';
import { BrokerEntity } from 'src/modules/company-contacts/brokers/entities/broker.entity';
import { ProductEntity } from 'src/modules/product-and-inventory/products/entities/product.entity';
import { JournalService } from 'src/modules/financial/journal/journal.service';
import { PurchaseOrder } from '../purchase-orders/entities/purchase-order.entity';

@Injectable()
export class SupplierInvoicesService {
  constructor(
    @InjectRepository(SupplierInvoice)
    private readonly invoiceRepo: Repository<SupplierInvoice>,
    @InjectRepository(SupplierInvoiceItem)
    private readonly itemRepo: Repository<SupplierInvoiceItem>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    @InjectRepository(SupplierEntity)
    private readonly supplierRepo: Repository<SupplierEntity>,
    @InjectRepository(BrokerEntity)
    private readonly brokerRepo: Repository<BrokerEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepo: Repository<PurchaseOrder>,
    private readonly journalService: JournalService,
  ) {}

 // ----------------------------
  // Supplier Invoices
  // ----------------------------
  async createInvoice(dto: CreateSupplierInvoiceDto): Promise<SupplierInvoice> {
    // 1) Validate references
    const company = await this.validateCompany(dto.companyId);
    const supplier = dto.supplierId
      ? await this.validateSupplier(dto.supplierId)
      : undefined;
    const broker = dto.brokerId
      ? await this.validateBroker(dto.brokerId)
      : undefined;

    // Optional: If you want to link a purchase order
    let purchaseOrder: PurchaseOrder | undefined;
    if (dto.purchaseOrderId) {
      // e.g. fetch it from your purchaseOrderRepo
      // or do a separate method
      // purchaseOrder = await this.purchaseOrderRepo.findOne({ where: { id: dto.purchaseOrderId }});
      // if (!purchaseOrder) throw new BadRequestException('Invalid purchaseOrderId.');
    }

    // 2) Build invoice
    const invoice = this.invoiceRepo.create({
      company,
      supplier,
      broker,
      purchaseOrder, // link if you want
      invoiceNumber: dto.invoiceNumber,
      invoiceDate: dto.invoiceDate ? new Date(dto.invoiceDate) : undefined,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      totalAmount: dto.totalAmount || 0,
      currency: dto.currency,
      status: dto.status || 'Unpaid',
    });

    // 3) Build items if provided
    if (dto.items?.length) {
      invoice.items = await Promise.all(
        dto.items.map(async (itemDto) => {
          const itemEntity = await this.buildInvoiceItem(itemDto);
          itemEntity.supplierInvoice = invoice;
          return itemEntity;
        }),
      );
    } else {
      invoice.items = [];
    }

    // Recalculate total from items if you prefer:
    const total = invoice.items.reduce((sum, it) => sum + it.totalPrice, 0);
    invoice.totalAmount = total;

    // 4) Save the invoice
    const savedInvoice = await this.invoiceRepo.save(invoice);

    // 5) Create the balanced journal entry (debit expense/inventory, credit AP)
    const journalEntry = await this.createPurchaseInvoiceJournal(savedInvoice);

    // 6) Link invoice -> journal
    savedInvoice.journalEntry = journalEntry;
    await this.invoiceRepo.save(savedInvoice);

    return savedInvoice;
  }

  async findAllInvoices(): Promise<SupplierInvoice[]> {
    return this.invoiceRepo.find({
      relations: [
        'company',
        'supplier',
        'broker',
        'items',
        'items.product',
        'purchaseOrder',
        'journalEntry',
      ],
    });
  }

  async findOneInvoice(id: string): Promise<SupplierInvoice> {
    const inv = await this.invoiceRepo.findOne({
      where: { id },
      relations: [
        'company',
        'supplier',
        'broker',
        'items',
        'items.product',
        'purchaseOrder',
        'journalEntry',
      ],
    });
    if (!inv) {
      throw new NotFoundException(`SupplierInvoice with id "${id}" not found.`);
    }
    return inv;
  }

  async updateInvoice(id: string, dto: UpdateSupplierInvoiceDto): Promise<SupplierInvoice> {
    const inv = await this.findOneInvoice(id);

    if (dto.companyId) {
      inv.company = await this.validateCompany(dto.companyId);
    }

    if (dto.supplierId !== undefined) {
      inv.supplier = dto.supplierId
        ? await this.validateSupplier(dto.supplierId)
        : undefined;
    }

    if (dto.brokerId !== undefined) {
      inv.broker = dto.brokerId
        ? await this.validateBroker(dto.brokerId)
        : undefined;
    }

    if (dto.invoiceNumber !== undefined) inv.invoiceNumber = dto.invoiceNumber;
    if (dto.invoiceDate) inv.invoiceDate = new Date(dto.invoiceDate);
    if (dto.dueDate) inv.dueDate = new Date(dto.dueDate);
    if (dto.totalAmount !== undefined) inv.totalAmount = dto.totalAmount;
    if (dto.currency !== undefined) inv.currency = dto.currency;
    if (dto.status !== undefined) inv.status = dto.status;

    // If items changed
    if (dto.items) {
      await this.itemRepo.remove(inv.items); // remove old
      inv.items = await Promise.all(
        dto.items.map(async (itemDto) => {
          const newItem = await this.buildInvoiceItem(itemDto);
          newItem.supplierInvoice = inv;
          return newItem;
        }),
      );
      const total = inv.items.reduce((sum, it) => sum + it.totalPrice, 0);
      inv.totalAmount = total;
    }

    // Save updated invoice
    const updatedInvoice = await this.invoiceRepo.save(inv);

    // Optionally update or create a new journal entry
    // e.g. you might remove old entry or post a correction entry
    // For simplicity, we won't illustrate that here.

    return updatedInvoice;
  }

  async removeInvoice(id: string): Promise<void> {
    const inv = await this.findOneInvoice(id);
    // Possibly remove or reverse the journal entry
    await this.invoiceRepo.remove(inv);
  }

  // ----------------------------
  // Supplier Invoice Items (Sub-resource)
  // ----------------------------
  private async buildInvoiceItem(dto: CreateSupplierInvoiceItemDto): Promise<SupplierInvoiceItem> {
    let product: ProductEntity | undefined;
    if (dto.productId) {
      product = await this.productRepo.findOne({ where: { id: dto.productId } });
      if (!product) {
        throw new BadRequestException('Invalid productId.');
      }
    }

    // Calculate totalPrice
    const base = dto.quantity * dto.unitPrice - (dto.discount || 0);
    const totalPrice = base + (base * (dto.taxRate || 0)) / 100;

    return this.itemRepo.create({
      product,
      quantity: dto.quantity,
      unitPrice: dto.unitPrice,
      discount: dto.discount || 0,
      taxRate: dto.taxRate || 0,
      totalPrice,
    });
  }

  // A sub-resource approach for items...
  async createItem(invoiceId: string, dto: CreateSupplierInvoiceItemDto): Promise<SupplierInvoiceItem> {
    const invoice = await this.findOneInvoice(invoiceId);
    const itemEntity = await this.buildInvoiceItem(dto);
    itemEntity.supplierInvoice = invoice;
    return this.itemRepo.save(itemEntity);
  }

  async findOneItem(id: string): Promise<SupplierInvoiceItem> {
    const item = await this.itemRepo.findOne({
      where: { id },
      relations: ['supplierInvoice', 'product'],
    });
    if (!item) {
      throw new NotFoundException(`SupplierInvoiceItem with id "${id}" not found.`);
    }
    return item;
  }

  async updateItem(id: string, dto: UpdateSupplierInvoiceItemDto): Promise<SupplierInvoiceItem> {
    const item = await this.findOneItem(id);

    if (dto.productId !== undefined) {
      if (dto.productId) {
        const product = await this.productRepo.findOne({ where: { id: dto.productId } });
        if (!product) {
          throw new BadRequestException('Invalid productId.');
        }
        item.product = product;
      } else {
        item.product = undefined;
      }
    }

    if (dto.quantity !== undefined) item.quantity = dto.quantity;
    if (dto.unitPrice !== undefined) item.unitPrice = dto.unitPrice;
    if (dto.discount !== undefined) item.discount = dto.discount;
    if (dto.taxRate !== undefined) item.taxRate = dto.taxRate;

    // Recalc total price
    const base = item.quantity * item.unitPrice - item.discount;
    item.totalPrice = base + (base * item.taxRate) / 100;

    return this.itemRepo.save(item);
  }

  async removeItem(id: string): Promise<void> {
    const item = await this.findOneItem(id);
    await this.itemRepo.remove(item);
  }

  // ----------------------------
  // HELPER METHODS
  // ----------------------------
  private async validateCompany(companyId: string): Promise<Company> {
    const company = await this.companyRepo.findOne({ where: { id: companyId } });
    if (!company) {
      throw new BadRequestException('Invalid companyId.');
    }
    return company;
  }

  private async validateSupplier(supplierId: string): Promise<SupplierEntity> {
    const supplier = await this.supplierRepo.findOne({ where: { id: supplierId } });
    if (!supplier) {
      throw new BadRequestException('Invalid supplierId.');
    }
    return supplier;
  }

  private async validateBroker(brokerId: string): Promise<BrokerEntity> {
    const broker = await this.brokerRepo.findOne({ where: { id: brokerId } });
    if (!broker) {
      throw new BadRequestException('Invalid brokerId.');
    }
    return broker;
  }

  // Create the balanced journal entry for a purchase invoice
  private async createPurchaseInvoiceJournal(inv: SupplierInvoice) {
    // Hard-coded account references (should come from config or database)
    const accountsPayableId = 'ACCOUNTS-PAYABLE-ID';
    const expenseOrInventoryId = 'EXPENSE-OR-INVENTORY-ID';

    const lines = [
      {
        accountId: expenseOrInventoryId,
        debit: inv.totalAmount,
        credit: 0,
      },
      {
        accountId: accountsPayableId,
        debit: 0,
        credit: inv.totalAmount,
      },
    ];

    // You can store the date in the invoiceDate or use new Date()
    const entry = await this.journalService.create({
      companyId: inv.company.id,
      entryDate: inv.invoiceDate?.toISOString() || new Date().toISOString(),
      reference: `Supplier Invoice #${inv.invoiceNumber}`,
      description: `Auto posted for invoice ${inv.id}`,
      lines,
    });

    return entry;
  }
}
