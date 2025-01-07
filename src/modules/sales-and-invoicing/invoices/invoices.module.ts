import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import { CustomerEntity } from 'src/modules/company-contacts/customers/entities/customer.entity';
import { BrokerEntity } from 'src/modules/company-contacts/brokers/entities/broker.entity';
import { ProductEntity } from 'src/modules/product-and-inventory/products/entities/product.entity';
import { JournalService } from 'src/modules/financial/journal/journal.service';
import { JournalEntry } from 'src/modules/financial/journal/entities/journal-entry.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Invoice,
      InvoiceItem,
      Company,
      CustomerEntity,
      BrokerEntity,
      ProductEntity,
      JournalEntry
    ]),
    
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, JournalService],
  exports: [InvoicesService],
})
export class InvoicesModule {}
