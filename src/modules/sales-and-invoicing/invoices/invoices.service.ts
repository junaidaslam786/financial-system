import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
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
import { SupplierEntity } from 'src/modules/company-contacts/suppliers/entities/supplier.entity';
import { PurchaseOrder } from 'src/modules/company-purchases/purchase-orders/entities/purchase-order.entity';
import { CreateInvoiceItemDto } from './dtos/create-invoice-item.dto';
import { ContactLedgerService } from 'src/modules/company-contacts/contact-ledger/contact-ledger.service';
import { ContactType } from 'src/common/enums/contact-type.enum';
// If you want to link a sales order

@Injectable()
export class InvoicesService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,

    @InjectRepository(InvoiceItem)
    private readonly invoiceItemRepo: Repository<InvoiceItem>,

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,

    @InjectRepository(SupplierEntity)
    private readonly supplierRepo: Repository<SupplierEntity>,

    @InjectRepository(CustomerEntity)
    private readonly customerRepo: Repository<CustomerEntity>,

    @InjectRepository(BrokerEntity)
    private readonly brokerRepo: Repository<BrokerEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,

    private readonly journalService: JournalService, // for auto-posting to ledger
    private readonly contactLedgerService: ContactLedgerService,
  ) {}

  // async create(dto: CreateInvoiceDto): Promise<Invoice> {
  //   // Use the transaction manager
  //   return this.dataSource.manager.transaction(async (manager) => {
  //     //
  //     // 1) Validate references
  //     //
  //     const company = await this.validateCompany(dto.companyId, manager);

  //     if (!['Purchase', 'Sale'].includes(dto.invoiceType)) {
  //       throw new BadRequestException(
  //         `invoiceType must be 'Purchase' or 'Sale'`,
  //       );
  //     }

  //     let customer: CustomerEntity | null = null;
  //     if (dto.customerId) {
  //       customer = await this.validateCustomer(dto.customerId, manager);
  //     }

  //     let supplier: SupplierEntity | null = null;
  //     if (dto.supplierId) {
  //       supplier = await this.validateSupplier(dto.supplierId, manager);
  //     }

  //     let broker: BrokerEntity | null = null;
  //     if (dto.brokerId) {
  //       broker = await this.validateBroker(dto.brokerId, manager);
  //     }

  //     //
  //     // 2) Build the invoice
  //     //
  //     const invoiceRepoTx = manager.getRepository(Invoice); // transaction-bound repo
  //     const invoice = invoiceRepoTx.create({
  //       company,
  //       invoiceType: dto.invoiceType,
  //       customer,
  //       supplier,
  //       broker,
  //       invoiceNumber: dto.invoiceNumber,
  //       invoiceDate: dto.invoiceDate ? new Date(dto.invoiceDate) : new Date(),
  //       dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
  //       termsAndConditions: dto.termsAndConditions,
  //       notes: dto.notes,
  //       status: 'Unpaid',
  //     });

  //     if (dto.salesOrderId) {
  //       invoice.salesOrder = { id: dto.salesOrderId } as SalesOrderEntity;
  //     }
  //     if (dto.purchaseOrderId) {
  //       invoice.purchaseOrder = { id: dto.purchaseOrderId } as PurchaseOrder;
  //     }

  //     //
  //     // 3) Build items (if any)
  //     //
  //     if (dto.items?.length) {
  //       const invoiceItemRepoTx = manager.getRepository(InvoiceItem);

  //       invoice.items = await Promise.all(
  //         dto.items.map((itemDto) =>
  //           this.buildInvoiceItem(itemDto, manager),
  //         ),
  //       );
  //     } else {
  //       invoice.items = [];
  //     }

  //     // Recalculate total
  //     const total = invoice.items.reduce((sum, i) => sum + i.totalPrice, 0);
  //     invoice.totalAmount = total;

  //     // Save invoice (still no journal linked)
  //     const savedInvoice = await invoiceRepoTx.save(invoice);

  //     //
  //     // 4) Auto-create the journal entry in the same transaction
  //     //
  //     const journalEntry = await this.createInvoiceJournal(savedInvoice, manager);

  //     // Link the newly created journal entry
  //     savedInvoice.journalEntry = journalEntry;
  //     await invoiceRepoTx.save(savedInvoice);

  //     // 5) Post to contact ledger
  //     // Purchase => credit the supplier ledger
  //     if (savedInvoice.invoiceType === 'Purchase' && savedInvoice.supplier) {
  //       await this.contactLedgerService.addCredit(
  //         company.id,
  //         ContactType.SUPPLIER,
  //         savedInvoice.supplier.id,
  //         savedInvoice.totalAmount,
  //         'INVOICE',
  //         savedInvoice.id,
  //         `Purchase Invoice #${savedInvoice.invoiceNumber}`,
  //         manager,
  //       );
  //     }

  //     // Sale => debit the customer ledger
  //     if (savedInvoice.invoiceType === 'Sale' && savedInvoice.customer) {
  //       await this.contactLedgerService.addDebit(
  //         company.id,
  //         ContactType.CUSTOMER,
  //         savedInvoice.customer.id,
  //         savedInvoice.totalAmount,
  //         'INVOICE',
  //         savedInvoice.id,
  //         `Sales Invoice #${savedInvoice.invoiceNumber}`,
  //         manager,
  //       );
  //     }

  //     return savedInvoice;
  //   });
  // }
  async create(
    dto: CreateInvoiceDto,
    manager?: EntityManager,
  ): Promise<Invoice> {
    const txnMgr = manager || this.dataSource.manager;
    return txnMgr.transaction(async (manager) => {
      // 1) Validate references
      const company = await this.validateCompany(dto.companyId, manager);
  
      if (!['Purchase', 'Sale'].includes(dto.invoiceType)) {
        throw new BadRequestException(
          `invoiceType must be 'Purchase' or 'Sale'`,
        );
      }
  
      let customer: CustomerEntity | null = null;
      if (dto.customerId) {
        customer = await this.validateCustomer(dto.customerId, manager);
      }
  
      let supplier: SupplierEntity | null = null;
      if (dto.supplierId) {
        supplier = await this.validateSupplier(dto.supplierId, manager);
      }
  
      let broker: BrokerEntity | null = null;
      if (dto.brokerId) {
        broker = await this.validateBroker(dto.brokerId, manager);
      }
  
      // 2) Build or fetch invoice items
      let itemsToUse: CreateInvoiceItemDto[] = dto.items;
  
      // If it's a Sales Invoice and no items provided but we have salesOrderId -> fetch lines
      if (
        dto.invoiceType === 'Sale' &&
        dto.salesOrderId &&
        (!dto.items || dto.items.length === 0)
      ) {
        itemsToUse = await this.loadSalesOrderLines(dto.salesOrderId, manager);
      }
  
      // If it's a Purchase Invoice and no items provided but we have purchaseOrderId -> fetch lines
      if (
        dto.invoiceType === 'Purchase' &&
        dto.purchaseOrderId &&
        (!dto.items || dto.items.length === 0)
      ) {
        itemsToUse = await this.loadPurchaseOrderLines(dto.purchaseOrderId, manager);
      }
  
      // 3) Build the invoice
      const invoiceRepoTx = manager.getRepository(Invoice);
      const invoice = invoiceRepoTx.create({
        company,
        invoiceType: dto.invoiceType,
        customer,
        supplier,
        broker,
        invoiceNumber: dto.invoiceNumber,
        invoiceDate: dto.invoiceDate ? new Date(dto.invoiceDate) : new Date(),
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        termsAndConditions: dto.termsAndConditions,
        notes: dto.notes,
        status: 'Unpaid',
        salesOrder: dto.salesOrderId
          ? ({ id: dto.salesOrderId } as SalesOrderEntity)
          : undefined,
        purchaseOrder: dto.purchaseOrderId
          ? ({ id: dto.purchaseOrderId } as PurchaseOrder)
          : undefined,
      });
  
      // 4) Build items (if any)
      if (itemsToUse?.length) {
        invoice.items = await Promise.all(
          itemsToUse.map((itemDto) => this.buildInvoiceItem(itemDto, manager)),
        );
      } else {
        invoice.items = [];
      }
  
      // re-sum total
      invoice.totalAmount = invoice.items.reduce(
        (sum, i) => sum + i.totalPrice,
        0,
      );
  
      // 5) Save invoice
      const savedInvoice = await invoiceRepoTx.save(invoice);
  
      // 6) Create the journal entry
      const journalEntry = await this.createInvoiceJournal(
        savedInvoice,
        manager,
      );
      savedInvoice.journalEntry = journalEntry;
      await invoiceRepoTx.save(savedInvoice);
  
      // 7) Post to contact ledger
      await this.postToLedger(savedInvoice, manager);
  
      return savedInvoice;
    });
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
        'supplier',
        'supplier.account',
        'customer',
        'customer.account',
        'broker',
        'broker.account',
        'company',
        'purchaseOrder',
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
        'supplier',
        'supplier.account',
        'customer.account',
        'broker.account',
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

    if (dto.supplierId !== undefined) {
      invoice.supplier = dto.supplierId
        ? await this.validateSupplier(dto.supplierId, this.dataSource.manager)
        : null;
    }

    if (dto.customerId !== undefined) {
      invoice.customer = dto.customerId
        ? await this.validateCustomer(dto.customerId, this.dataSource.manager)
        : null;
    }

    if (dto.brokerId !== undefined) {
      invoice.broker = dto.brokerId
        ? await this.validateBroker(dto.brokerId, this.dataSource.manager)
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

    if (dto.currency !== undefined) invoice.currency = dto.currency;
    if (dto.status !== undefined) invoice.status = dto.status;
    // if (dto.status !== undefined) {
    //   invoice.status = dto.status;
    // }

    // Rebuild items if provided
    if (dto.items) {
      // remove old items
      await this.invoiceItemRepo.remove(invoice.items);
      // build new
      const newItems = await Promise.all(
        dto.items.map((i) => this.buildInvoiceItem(i, this.dataSource.manager)),
      );
      invoice.items = newItems;
      // re-sum total
      invoice.totalAmount = newItems.reduce((sum, i) => sum + i.totalPrice, 0);
    }

    // Possibly also re-link the invoice to a different sales order if needed
    if (dto.salesOrderId !== undefined) {
      invoice.salesOrder = dto.salesOrderId
        ? ({ id: dto.salesOrderId } as SalesOrderEntity)
        : undefined;
    }

    if (dto.purchaseOrderId !== undefined) {
      invoice.purchaseOrder = dto.purchaseOrderId
        ? ({ id: dto.purchaseOrderId } as PurchaseOrder)
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
  private async validateCompany(
    companyId: string,
    manager: EntityManager,
  ): Promise<Company> {
    const company = await manager.getRepository(Company).findOne({
      where: { id: companyId },
    });
    if (!company) {
      throw new BadRequestException('Invalid companyId.');
    }
    return company;
  }

  private async validateCustomer(
    customerId: string,
    manager: EntityManager,
  ): Promise<CustomerEntity> {
    const customer = await manager.getRepository(CustomerEntity).findOne({
      where: { id: customerId },
    });
    if (!customer) {
      throw new BadRequestException('Invalid customerId.');
    }
    return customer;
  }

  private async validateSupplier(
    supplierId: string,
    manager: EntityManager,
  ): Promise<SupplierEntity> {
    const supplier = await manager.getRepository(SupplierEntity).findOne({
      where: { id: supplierId },
    });
    if (!supplier) {
      throw new BadRequestException('Invalid supplierId.');
    }
    return supplier;
  }

  private async validateBroker(
    brokerId: string,
    manager: EntityManager,
  ): Promise<BrokerEntity> {
    const broker = await manager
      .getRepository(BrokerEntity)
      .findOne({ where: { id: brokerId } });
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

  private async loadSalesOrderLines(
    salesOrderId: string,
    manager: EntityManager,
  ): Promise<CreateInvoiceItemDto[]> {
    const so = await manager.getRepository(SalesOrderEntity).findOne({
      where: { id: salesOrderId },
      relations: ['lines', 'lines.product'],
    });
    if (!so) {
      throw new BadRequestException(`Sales order not found: ${salesOrderId}`);
    }

    // Convert each SalesOrderLine to CreateInvoiceItemDto
    return so.lines.map((line) => ({
      productId: line.product?.id,
      quantity: Number(line.quantity),
      unitPrice: Number(line.unitPrice),
      discount: Number(line.discount) || 0,
      taxRate: Number(line.taxRate) || 0,
      description: line.product?.productName,
    }));
  }

  private async loadPurchaseOrderLines(
    purchaseOrderId: string,
    manager: EntityManager,
  ): Promise<CreateInvoiceItemDto[]> {
    const po = await manager.getRepository(PurchaseOrder).findOne({
      where: { id: purchaseOrderId },
      relations: ['lines', 'lines.product'],
    });
    if (!po) {
      throw new BadRequestException(`Purchase order not found: ${purchaseOrderId}`);
    }
  
    return po.lines.map((line) => ({
      productId: line.product?.id,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      discount: line.discount,
      taxRate: line.taxRate,
      description: line.product?.productName,
    }));
  }
  

  private async postToLedger(inv: Invoice, manager: EntityManager) {
    if (inv.invoiceType === 'Purchase' && inv.supplier) {
      await this.contactLedgerService.addCredit(
        inv.company.id,
        ContactType.SUPPLIER,
        inv.supplier.id,
        inv.totalAmount,
        'INVOICE',
        inv.id,
        `Purchase Invoice #${inv.invoiceNumber}`,
        manager,
      );
    } else if (inv.invoiceType === 'Sale' && inv.customer) {
      await this.contactLedgerService.addDebit(
        inv.company.id,
        ContactType.CUSTOMER,
        inv.customer.id,
        inv.totalAmount,
        'INVOICE',
        inv.id,
        `Sales Invoice #${inv.invoiceNumber}`,
        manager,
      );
    }
  }

  // ----------------------------
  // Private Helpers
  // ----------------------------
  private async buildInvoiceItem(
    dto: CreateInvoiceItemDto,
    manager: EntityManager,
  ): Promise<InvoiceItem> {
    let product: ProductEntity | undefined;
    if (dto.productId) {
      product = await manager
        .getRepository(ProductEntity)
        .findOne({ where: { id: dto.productId } });
      if (!product) {
        throw new BadRequestException(`Invalid productId: ${dto.productId}`);
      }
    }

    // lineDescription can store "Labor", "Transportation", "Brokerage" etc. if no product
    const base = dto.quantity * dto.unitPrice - (dto.discount || 0);
    const totalPrice = base + (base * (dto.taxRate || 0)) / 100;

    return this.invoiceItemRepo.create({
      product,
      description: dto.description,
      quantity: dto.quantity,
      unitPrice: dto.unitPrice,
      discount: dto.discount || 0,
      taxRate: dto.taxRate || 0,
      totalPrice,
    });
  }

  /**
   * Auto-create the correct journal entry lines:
   *  If Purchase -> Debit Inventory/Expense, Credit AP
   *  If Sale -> Debit AR, Credit Sales
   */
  // private async createInvoiceJournal(inv: Invoice, manager: EntityManager) {
  //   const company = inv.company;

  //   if (inv.invoiceType === 'Purchase') {
  //     // Purchase: need default AP account, default expense or inventory account
  //     if (!company.defaultApAccountId) {
  //       throw new BadRequestException(
  //         'No default AP account for purchase invoices',
  //       );
  //     }
  //     if (!company.defaultCashAccountId) {
  //       // or company.defaultExpenseAccountId or defaultInventoryId
  //       throw new BadRequestException(
  //         'No default expense or inventory account set',
  //       );
  //     }

  //     if (typeof inv.invoiceDate === 'string') {
  //       inv.invoiceDate = new Date(inv.invoiceDate);
  //     }

  //     const lines = [
  //       {
  //         accountId: company.defaultCashAccountId, // or defaultExpenseAccountId
  //         debit: inv.totalAmount,
  //         credit: 0,
  //       },
  //       {
  //         accountId: company.defaultApAccountId,
  //         debit: 0,
  //         credit: inv.totalAmount,
  //       },
  //     ];

  //     const journalEntry = await this.journalService.createInTransaction(
  //       manager,
  //       {
  //         companyId: company.id,
  //         entryDate: inv.invoiceDate,
  //         reference: `Purchase Invoice #${inv.invoiceNumber}`,
  //         description: `Auto posted purchase invoice ${inv.id}`,
  //         lines, // ...
  //       },
  //     );

  //     return journalEntry;
  //   } else {
  //     // Sale
  //     if (!company.defaultArAccountId) {
  //       throw new BadRequestException(
  //         'No default AR account for sales invoices',
  //       );
  //     }
  //     if (!company.defaultSalesAccountId) {
  //       throw new BadRequestException(
  //         'No default Sales account for sales invoices',
  //       );
  //     }

  //     const lines = [
  //       {
  //         accountId: company.defaultArAccountId,
  //         debit: inv.totalAmount,
  //         credit: 0,
  //       },
  //       {
  //         accountId: company.defaultSalesAccountId,
  //         debit: 0,
  //         credit: inv.totalAmount,
  //       },
  //     ];

  //     const journalEntry = await this.journalService.create({
  //       companyId: company.id,
  //       entryDate: inv.invoiceDate,
  //       reference: `Sales Invoice #${inv.invoiceNumber}`,
  //       description: `Auto posted sales invoice ${inv.id}`,
  //       lines,
  //     });
  //     return journalEntry;
  //   }
  // }

  private async createInvoiceJournal(inv: Invoice, manager: EntityManager) {
    const company = inv.company;

    console.log("Invoice", inv);
  
    if (inv.invoiceType === 'Purchase') {
      // 1) We want the supplier's AP account for credit
      if (!inv.supplier || !inv.supplier?.account?.id) {
        throw new BadRequestException('Supplier or supplier account not set.');
      }
      // 2) Choose a default expense or inventory for the debit
      const debitAccountId = company.defaultApAccountId 
                             || company.defaultCashAccountId;
      if (!debitAccountId) {
        throw new BadRequestException('No default expense or inventory account set');
      }
  
      const lines = [
        {
          accountId: debitAccountId,
          debit: inv.totalAmount,
          credit: 0,
        },
        {
          accountId: inv.supplier?.account?.id, // Supplier’s AP account
          debit: 0,
          credit: inv.totalAmount,
        },
      ];
  
      // Create the JournalEntry
      return this.journalService.createInTransaction(manager, {
        companyId: company.id,
        entryDate: inv.invoiceDate,
        reference: `Purchase Invoice #${inv.invoiceNumber}`,
        description: `Auto posted purchase invoice ${inv.id}`,
        lines,
      });
  
    } else {
      // Sale
      if (!inv.customer || !inv.customer.account) {
        throw new BadRequestException('Customer or customer account not set.');
      }
      if (!company.defaultSalesAccountId) {
        throw new BadRequestException('No default Sales account for sales invoices');
      }
  
      const lines = [
        {
          // Customer’s AR account
          accountId: inv.customer.account?.id,
          debit: inv.totalAmount,
          credit: 0,
        },
        {
          // Company’s default Sales revenue
          accountId: company.defaultSalesAccountId,
          debit: 0,
          credit: inv.totalAmount,
        },
      ];
  
      return this.journalService.createInTransaction(manager, {
        companyId: company.id,
        entryDate: inv.invoiceDate,
        reference: `Sales Invoice #${inv.invoiceNumber}`,
        description: `Auto posted sales invoice ${inv.id}`,
        lines,
      });
    }
  }
  


}
