import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesOrdersService } from './sales-orders.service';
import { SalesOrdersController } from './sales-orders.controller';
import { SalesOrderEntity } from './entities/sales-order.entity';
import { SalesOrderLine } from './entities/sales-order-line.entity';
import { CustomersModule } from 'src/modules/company-contacts/customers/customers.module';
import { TraderEntity } from 'src/modules/company-contacts/traders/entities/trader.entity';
import { TradersModule } from 'src/modules/company-contacts/traders/traders.module';
import { CustomerEntity } from 'src/modules/company-contacts/customers/entities/customer.entity';
import { InvoicesModule } from '../invoices/invoices.module';

@Module({
  imports: [TypeOrmModule.forFeature([SalesOrderEntity, SalesOrderLine, TraderEntity, CustomerEntity]),
  CustomersModule,
  TradersModule,
  InvoicesModule
],
  controllers: [SalesOrdersController],
  providers: [SalesOrdersService],
})
export class SalesOrdersModule {}
