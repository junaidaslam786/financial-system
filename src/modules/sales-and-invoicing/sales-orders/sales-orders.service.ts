import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesOrderEntity } from './entities/sales-order.entity';
import { CreateSalesOrderDto } from './dtos/create-sales-order.dto';
import { CustomerEntity } from 'src/modules/company-contacts/customers/entities/customer.entity';
import { TraderEntity } from 'src/modules/company-contacts/traders/entities/trader.entity';
import { SalesOrderLine } from './entities/sales-order-line.entity';
import { ProductEntity } from 'src/modules/product-and-inventory/products/entities/product.entity';

@Injectable()
export class SalesOrdersService {
  constructor(
    @InjectRepository(SalesOrderEntity)
    private readonly salesOrderRepo: Repository<SalesOrderEntity>,
    @InjectRepository(CustomerEntity)
    private readonly customerRepo: Repository<CustomerEntity>,
    @InjectRepository(TraderEntity)
    private readonly traderRepo: Repository<TraderEntity>,
  ) {}

  async create(dto: CreateSalesOrderDto): Promise<SalesOrderEntity> {
    const totalAmount = dto.lines.reduce((sum, line) => {
      const lineTotal = line.quantity * line.unitPrice - line.discount;
      return sum + lineTotal + (lineTotal * line.taxRate) / 100;
    }, 0);

    const order = this.salesOrderRepo.create({
      company: { id: dto.companyId },
      customer: dto.customerId ? { id: dto.customerId } : undefined,
      trader: dto.traderId ? { id: dto.traderId } : undefined,
      brokerage: dto.brokerageId ? { id: dto.brokerageId } : undefined,
      orderNumber: dto.orderNumber,
      orderDate: dto.orderDate ? new Date(dto.orderDate) : undefined,
      status: dto.status || 'Pending',
      notes: dto.notes,
      totalAmount,
      lines: dto.lines.map((line) => ({
        product: { id: line.productId },
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        discount: line.discount || 0,
        taxRate: line.taxRate || 0,
      })),
    });

    return this.salesOrderRepo.save(order);
  }

  async findAll(companyId: string): Promise<SalesOrderEntity[]> {
    return this.salesOrderRepo.find({
      where: { company: { id: companyId } },
      relations: ['customer', 'trader', 'brokerage', 'lines', 'lines.product'],
    });
  }

  async findOne(id: string): Promise<SalesOrderEntity> {
    const order = await this.salesOrderRepo.findOne({
      where: { id },
      relations: ['customer', 'trader', 'brokerage', 'lines', 'lines.product'],
    });
    if (!order) {
      throw new NotFoundException(`Sales order with ID "${id}" not found.`);
    }
    return order;
  }

  async update(id: string, dto: CreateSalesOrderDto): Promise<SalesOrderEntity> {
    const order = await this.findOne(id);
  
    // Update basic fields
    order.customer = dto.customerId ? await this.customerRepo.findOne({ where: { id: dto.customerId } }) : undefined;
    order.trader = dto.traderId ? await this.traderRepo.findOne({ where: { id: dto.traderId } }) : undefined;
    order.status = dto.status || order.status;
    order.notes = dto.notes || order.notes;
  
    // Recalculate total amount
    const totalAmount = dto.lines.reduce((sum, line) => {
      const lineTotal = line.quantity * line.unitPrice - line.discount;
      return sum + lineTotal + (lineTotal * line.taxRate) / 100;
    }, 0);
    order.totalAmount = totalAmount;
  
    // Update lines
    order.lines = dto.lines.map((line) => {
      const orderLine = new SalesOrderLine();
      orderLine.product = { id: line.productId } as ProductEntity; // or fetch the Product entity if needed
      orderLine.quantity = line.quantity;
      orderLine.unitPrice = line.unitPrice;
      orderLine.discount = line.discount || 0;
      orderLine.taxRate = line.taxRate || 0;
      orderLine.salesOrder = order;
      return orderLine;
    });
  
    return this.salesOrderRepo.save(order);
  }
  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.salesOrderRepo.remove(order);
  }
}
