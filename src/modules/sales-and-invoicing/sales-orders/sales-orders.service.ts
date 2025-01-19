import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { SalesOrderEntity } from './entities/sales-order.entity';
import { CreateSalesOrderDto } from './dtos/create-sales-order.dto';
import { CustomerEntity } from 'src/modules/company-contacts/customers/entities/customer.entity';
import { TraderEntity } from 'src/modules/company-contacts/traders/entities/trader.entity';
import { SalesOrderLine } from './entities/sales-order-line.entity';
import { ProductEntity } from 'src/modules/product-and-inventory/products/entities/product.entity';
import { BrokerEntity } from 'src/modules/company-contacts/brokers/entities/broker.entity';
import { InvoicesService } from '../invoices/invoices.service';

@Injectable()
export class SalesOrdersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(SalesOrderEntity)
    private readonly salesOrderRepo: Repository<SalesOrderEntity>,
    @InjectRepository(CustomerEntity)
    private readonly customerRepo: Repository<CustomerEntity>,
    @InjectRepository(TraderEntity)
    private readonly traderRepo: Repository<TraderEntity>,
    private readonly invoicesService: InvoicesService,
  ) {}

  // async create(dto: CreateSalesOrderDto): Promise<SalesOrderEntity> {
  //   const totalAmount = dto.lines.reduce((sum, line) => {
  //     const lineTotal = line.quantity * line.unitPrice - line.discount;
  //     return sum + lineTotal + (lineTotal * line.taxRate) / 100;
  //   }, 0);

  //   const order = this.salesOrderRepo.create({
  //     company: { id: dto.companyId },
  //     customer: dto.customerId ? { id: dto.customerId } : undefined,
  //     trader: dto.traderId ? { id: dto.traderId } : undefined,
  //     brokerage: dto.brokerageId ? { id: dto.brokerageId } : undefined,
  //     orderNumber: dto.orderNumber,
  //     orderDate: dto.orderDate ? new Date(dto.orderDate) : undefined,
  //     status: dto.status || 'Pending',
  //     notes: dto.notes,
  //     totalAmount,
  //     lines: dto.lines.map((line) => ({
  //       product: { id: line.productId },
  //       quantity: line.quantity,
  //       unitPrice: line.unitPrice,
  //       discount: line.discount || 0,
  //       taxRate: line.taxRate || 0,
  //     })),
  //   });

  //   return this.salesOrderRepo.save(order);
  // }

  async create(dto: CreateSalesOrderDto): Promise<SalesOrderEntity> {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      // 1) Validate references (e.g. customer, trader, broker)
      let customer: CustomerEntity | undefined;
      if (dto.customerId) {
        customer = await manager.getRepository(CustomerEntity).findOne({
          where: { id: dto.customerId },
        });
        if (!customer) {
          throw new BadRequestException(
            `Invalid customerId: ${dto.customerId}`,
          );
        }
      }

      let trader: TraderEntity | undefined;
      if (dto.traderId) {
        trader = await manager.getRepository(TraderEntity).findOne({
          where: { id: dto.traderId },
        });
        if (!trader) {
          throw new BadRequestException(`Invalid traderId: ${dto.traderId}`);
        }
      }

      let brokerage: BrokerEntity | undefined;
      if (dto.brokerId) {
        brokerage = await manager.getRepository(BrokerEntity).findOne({
          where: { id: dto.brokerId },
        });
        if (!brokerage) {
          throw new BadRequestException(`Invalid brokerId: ${dto.brokerId}`);
        }
      }

      // 2) Calculate total if needed
      const totalAmount = dto.lines.reduce((sum, line) => {
        const lineTotal = line.quantity * line.unitPrice - (line.discount || 0);
        return sum + lineTotal + (lineTotal * (line.taxRate || 0)) / 100;
      }, 0);

      // 3) Build the SalesOrder entity
      const soRepoTx = manager.getRepository(SalesOrderEntity);
      const salesOrder = soRepoTx.create({
        company: { id: dto.companyId }, // must exist
        customer,
        trader,
        brokerage,
        orderNumber: dto.orderNumber, // or auto-generate
        orderDate: dto.orderDate ? new Date(dto.orderDate) : new Date(),
        status: dto.status || 'Pending',
        notes: dto.notes,
        totalAmount,
        // if your dto includes autoInvoicing boolean:
        autoInvoicing: dto.autoInvoicing === true,

        lines: dto.lines.map((lineDto) => {
          const line = new SalesOrderLine();
          line.product = { id: lineDto.productId } as ProductEntity;
          line.quantity = lineDto.quantity;
          line.unitPrice = lineDto.unitPrice;
          line.discount = lineDto.discount || 0;
          line.taxRate = lineDto.taxRate || 0;
          return line;
        }),
      });

      // Save the sales order
      const savedOrder = await soRepoTx.save(salesOrder);

      // 4) If autoInvoicing = true => create invoice from sales order in the same transaction
      if (savedOrder.autoInvoicing) {
        // We'll rely on the InvoicesService's logic to load lines from the order
        // if the invoice items are not specified
        await this.invoicesService.create(
          {
            companyId: dto.companyId,
            invoiceType: 'Sale',
            salesOrderId: savedOrder.id,
            invoiceDate: savedOrder.orderDate ? new Date(dto.orderDate) : new Date(),
            customerId: savedOrder.customer?.id,
            brokerId: savedOrder.brokerage?.id,
            status: 'Unpaid',
            invoiceNumber: `INV-SO-${savedOrder.orderNumber}`,
            // no items => the invoice service can fetch from the sales order
            items: [],
          },
          manager,
        );
      }

      return savedOrder;
    });
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

  async update(
    id: string,
    dto: CreateSalesOrderDto,
  ): Promise<SalesOrderEntity> {
    const order = await this.findOne(id);

    // Update basic fields
    order.customer = dto.customerId
      ? await this.customerRepo.findOne({ where: { id: dto.customerId } })
      : undefined;
    order.trader = dto.traderId
      ? await this.traderRepo.findOne({ where: { id: dto.traderId } })
      : undefined;
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
