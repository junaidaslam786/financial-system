import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';

import { CustomersModule } from 'src/modules/company-contacts/customers/customers.module';
import { BrokersModule } from 'src/modules/company-contacts/brokers/brokers.module';
import { ProductsModule } from 'src/modules/product-and-inventory/products/products.module';
import { CompaniesModule } from 'src/modules/companies/companies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, InvoiceItem]),
    CustomersModule, // To fetch customer details and validate customer-related data
    BrokersModule, // To fetch broker details and validate broker-related data
    ProductsModule, // To validate product-related data in invoice items
    CompaniesModule, // For company validation and data access
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService], // Exporting the service for potential use in other modules
})
export class InvoicesModule {}
