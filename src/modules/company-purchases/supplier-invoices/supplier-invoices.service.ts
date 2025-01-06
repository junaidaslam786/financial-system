import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
  ) {}

  // ----------------------------
  // Supplier Invoices
  // ----------------------------
  async createInvoice(dto: CreateSupplierInvoiceDto): Promise<SupplierInvoice> {
    let company: Company | undefined;
    if (dto.companyId) {
      company = await this.companyRepo.findOne({ where: { id: dto.companyId } });
      if (!company) {
        throw new BadRequestException('Invalid companyId.');
      }
    }

    let supplier: SupplierEntity | undefined;
    if (dto.supplierId) {
      supplier = await this.supplierRepo.findOne({ where: { id: dto.supplierId } });
      if (!supplier) {
        throw new BadRequestException('Invalid supplierId.');
      }
    }

    let broker: BrokerEntity | undefined;
    if (dto.brokerId) {
      broker = await this.brokerRepo.findOne({ where: { id: dto.brokerId } });
      if (!broker) {
        throw new BadRequestException('Invalid brokerId.');
      }
    }

    const invoice = this.invoiceRepo.create({
      company,
      supplier,
      broker,
      invoiceNumber: dto.invoiceNumber,
      invoiceDate: dto.invoiceDate ? new Date(dto.invoiceDate) : undefined,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      totalAmount: dto.totalAmount || 0,
      currency: dto.currency,
      status: dto.status || 'Unpaid',
    });

    // If items provided
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

    return this.invoiceRepo.save(invoice);
  }

  async findAllInvoices(): Promise<SupplierInvoice[]> {
    return this.invoiceRepo.find({
      relations: ['company', 'supplier', 'broker', 'items', 'items.product'],
    });
  }

  async findOneInvoice(id: string): Promise<SupplierInvoice> {
    const inv = await this.invoiceRepo.findOne({
      where: { id },
      relations: ['company', 'supplier', 'broker', 'items', 'items.product'],
    });
    if (!inv) {
      throw new NotFoundException(`SupplierInvoice with id "${id}" not found.`);
    }
    return inv;
  }

  async updateInvoice(id: string, dto: UpdateSupplierInvoiceDto): Promise<SupplierInvoice> {
    const inv = await this.findOneInvoice(id);

    if (dto.companyId) {
      const company = await this.companyRepo.findOne({ where: { id: dto.companyId } });
      if (!company) {
        throw new BadRequestException('Invalid companyId.');
      }
      inv.company = company;
    }

    if (dto.supplierId) {
      const supplier = await this.supplierRepo.findOne({ where: { id: dto.supplierId } });
      if (!supplier) {
        throw new BadRequestException('Invalid supplierId.');
      }
      inv.supplier = supplier;
    } else if (dto.supplierId === null) {
      inv.supplier = undefined;
    }

    if (dto.brokerId) {
      const broker = await this.brokerRepo.findOne({ where: { id: dto.brokerId } });
      if (!broker) {
        throw new BadRequestException('Invalid brokerId.');
      }
      inv.broker = broker;
    } else if (dto.brokerId === null) {
      inv.broker = undefined;
    }

    if (dto.invoiceNumber !== undefined) inv.invoiceNumber = dto.invoiceNumber;
    if (dto.invoiceDate) inv.invoiceDate = new Date(dto.invoiceDate);
    if (dto.dueDate) inv.dueDate = new Date(dto.dueDate);
    if (dto.totalAmount !== undefined) inv.totalAmount = dto.totalAmount;
    if (dto.currency !== undefined) inv.currency = dto.currency;
    if (dto.status !== undefined) inv.status = dto.status;

    // If we want to handle item updates in the same call
    if (dto.items) {
      await this.itemRepo.remove(inv.items);
      inv.items = await Promise.all(
        dto.items.map(async (itemDto) => {
          const newItem = await this.buildInvoiceItem(itemDto);
          newItem.supplierInvoice = inv;
          return newItem;
        }),
      );
    }

    return this.invoiceRepo.save(inv);
  }

  async removeInvoice(id: string): Promise<void> {
    const inv = await this.findOneInvoice(id);
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

    return this.itemRepo.create({
      product,
      quantity: dto.quantity,
      unitPrice: dto.unitPrice,
      discount: dto.discount || 0,
      taxRate: dto.taxRate || 0,
    });
  }

  async createItem(
    invoiceId: string,
    dto: CreateSupplierInvoiceItemDto,
  ): Promise<SupplierInvoiceItem> {
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

    if (dto.productId) {
      const product = await this.productRepo.findOne({ where: { id: dto.productId } });
      if (!product) {
        throw new BadRequestException('Invalid productId.');
      }
      item.product = product;
    } else if (dto.productId === null) {
      item.product = undefined;
    }

    if (dto.quantity !== undefined) item.quantity = dto.quantity;
    if (dto.unitPrice !== undefined) item.unitPrice = dto.unitPrice;
    if (dto.discount !== undefined) item.discount = dto.discount;
    if (dto.taxRate !== undefined) item.taxRate = dto.taxRate;

    return this.itemRepo.save(item);
  }

  async removeItem(id: string): Promise<void> {
    const item = await this.findOneItem(id);
    await this.itemRepo.remove(item);
  }
}
