import {
    Injectable,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Invoice } from './entities/invoice.entity';
  import { CreateInvoiceDto } from './dtos/create-invoice.dto';
  import { UpdateInvoiceDto } from './dtos/update-invoice.dto';
  import { InvoiceItem } from './entities/invoice-item.entity';
  
  @Injectable()
  export class InvoicesService {
    constructor(
      @InjectRepository(Invoice)
      private readonly invoiceRepo: Repository<Invoice>,
      @InjectRepository(InvoiceItem)
      private readonly invoiceItemRepo: Repository<InvoiceItem>,
    ) {}
  
    /**
     * Create a new invoice with items
     */
    async create(dto: CreateInvoiceDto): Promise<Invoice> {
      const invoice = this.invoiceRepo.create({
        company: { id: dto.companyId } as any,
        customer: dto.customerId ? { id: dto.customerId } as any : null,
        broker: dto.brokerId ? { id: dto.brokerId } as any : null,
        invoiceNumber: dto.invoiceNumber,
        invoiceDate: dto.invoiceDate ? new Date(dto.invoiceDate) : new Date(),
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        termsAndConditions: dto.termsAndConditions,
        notes: dto.notes,
        items: dto.items.map((itemDto) => {
          const item = new InvoiceItem();
          item.product = { id: itemDto.productId } as any;
          item.quantity = itemDto.quantity;
          item.unitPrice = itemDto.unitPrice;
          item.discount = itemDto.discount || 0;
          item.taxRate = itemDto.taxRate || 0;
          item.totalPrice =
            itemDto.quantity * itemDto.unitPrice -
            itemDto.discount +
            ((itemDto.quantity * itemDto.unitPrice - itemDto.discount) *
              itemDto.taxRate) /
              100;
          return item;
        }),
      });
  
      // Calculate total amount
      invoice.totalAmount = invoice.items.reduce(
        (sum, item) => sum + item.totalPrice,
        0,
      );
  
      return this.invoiceRepo.save(invoice);
    }
  
    /**
     * Get all invoices for a specific company
     */
    async findAll(companyId: string): Promise<Invoice[]> {
      return this.invoiceRepo.find({
        where: { company: { id: companyId } },
        relations: ['items', 'customer', 'broker'],
        order: { createdAt: 'DESC' },
      });
    }
  
    /**
     * Get a specific invoice by ID
     */
    async findOne(id: string): Promise<Invoice> {
      const invoice = await this.invoiceRepo.findOne({
        where: { id },
        relations: ['items', 'customer', 'broker'],
      });
  
      if (!invoice) {
        throw new NotFoundException(`Invoice with ID "${id}" not found`);
      }
  
      return invoice;
    }
  
    /**
     * Update an existing invoice
     */
    async update(id: string, dto: UpdateInvoiceDto): Promise<Invoice> {
      const invoice = await this.findOne(id);
  
      if (dto.customerId) {
        invoice.customer = { id: dto.customerId } as any;
      }
      if (dto.brokerId) {
        invoice.broker = { id: dto.brokerId } as any;
      }
      if (dto.invoiceDate) {
        invoice.invoiceDate = new Date(dto.invoiceDate);
      }
      if (dto.dueDate) {
        invoice.dueDate = new Date(dto.dueDate);
      }
      if (dto.termsAndConditions) {
        invoice.termsAndConditions = dto.termsAndConditions;
      }
      if (dto.notes) {
        invoice.notes = dto.notes;
      }
      if (dto.items) {
        const updatedItems = dto.items.map((itemDto) => {
          const item = new InvoiceItem();
          item.product = { id: itemDto.productId } as any;
          item.quantity = itemDto.quantity;
          item.unitPrice = itemDto.unitPrice;
          item.discount = itemDto.discount || 0;
          item.taxRate = itemDto.taxRate || 0;
          item.totalPrice =
            itemDto.quantity * itemDto.unitPrice -
            itemDto.discount +
            ((itemDto.quantity * itemDto.unitPrice - itemDto.discount) *
              itemDto.taxRate) /
              100;
          return item;
        });
  
        invoice.items = updatedItems;
        invoice.totalAmount = updatedItems.reduce(
          (sum, item) => sum + item.totalPrice,
          0,
        );
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
  