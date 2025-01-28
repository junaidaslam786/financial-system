import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotsService } from './lots.service';
import { LotsController } from './lots.controller';
import { LotEntity } from './entities/lot.entity';
import { InvoiceItem } from 'src/modules/sales-and-invoicing/invoices/entities/invoice-item.entity';
import { SalesOrderLine } from 'src/modules/sales-and-invoicing/sales-orders/entities/sales-order-line.entity';
import { PurchaseOrderLine } from 'src/modules/company-purchases/purchase-orders/entities/purchase-order-line.entity';
import { ProductionOrderEntity } from '../production-orders/entities/production-order.entity';
import { PurchaseOrder } from 'src/modules/company-purchases/purchase-orders/entities/purchase-order.entity';
import { SalesOrderEntity } from 'src/modules/sales-and-invoicing/sales-orders/entities/sales-order.entity';
import { Invoice } from 'src/modules/sales-and-invoicing/invoices/entities/invoice.entity';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LotEntity,
      PurchaseOrderLine,
      SalesOrderLine,
      InvoiceItem,
      ProductionOrderEntity,
      PurchaseOrder,
      SalesOrderEntity,
      Invoice,
    ]),
    UsersModule

  ],
  controllers: [LotsController],
  providers: [LotsService],
  exports: [LotsService],
})
export class LotsModule {}
