import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierInvoicesService } from './supplier-invoices.service';
import { SupplierInvoicesController } from './supplier-invoices.controller';
import { SupplierInvoice } from './entities/supplier-invoice.entity';
import { SupplierInvoiceItem } from './entities/supplier-invoice-item.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import { SupplierEntity } from 'src/modules/company-contacts/suppliers/entities/supplier.entity';
import { BrokerEntity } from 'src/modules/company-contacts/brokers/entities/broker.entity';
import { ProductEntity } from 'src/modules/product-and-inventory/products/entities/product.entity';
import { PurchaseOrder } from '../purchase-orders/entities/purchase-order.entity';
import { JournalService } from 'src/modules/financial/journal/journal.service';
import { JournalEntry } from 'src/modules/financial/journal/entities/journal-entry.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SupplierInvoice,
      SupplierInvoiceItem,
      Company,
      SupplierEntity,
      BrokerEntity,
      ProductEntity,
      PurchaseOrder,
      JournalEntry
    ]),
  ],
  controllers: [SupplierInvoicesController],
  providers: [SupplierInvoicesService, JournalService],
  exports: [SupplierInvoicesService],
})
export class SupplierInvoicesModule {}
