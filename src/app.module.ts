import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import { validateEnvironment } from './config/env.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { CompanyOwnersModule } from './modules/company-owners/company-owners.module';
import { PartnersModule } from './modules/partners/partners.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { UomModule } from './modules/units-of-measure/uom.module';
import { AccountsModule } from './modules/financial/accounts/accounts.module';
import { CurrenciesModule } from './modules/financial/currencies/currencies.module';
import { ExchangeRatesModule } from './modules/financial/exchange-rates/exchange-rates.module';
import { JournalModule } from './modules/financial/journal/journal.module';
import { PriceListsModule } from './modules/financial/price-lists/price-lists.module';
import { SuppliersModule } from './modules/company-contacts/suppliers/suppliers.module';
import { CustomersModule } from './modules/company-contacts/customers/customers.module';
import { TradersModule } from './modules/company-contacts/traders/traders.module';
import { BrokersModule } from './modules/company-contacts/brokers/brokers.module';
import { BrokerageAgreementsModule } from './modules/company-contacts/brokerage-agreements/brokerage-agreements.module';
import { BrokerageTransactionsModule } from './modules/company-contacts/brokerage-transactions/brokerage-transactions.module';
import { ContactsModule } from './modules/company-contacts/contacts/contacts.module';
import { InventoryModule } from './modules/product-and-inventory/inventory/inventory.module';
import { InventoryMovementsModule } from './modules/product-and-inventory/inventory-movements/inventory-movements.module';
import { LotRawMaterialsModule } from './modules/product-and-inventory/lot-raw-materials/lot-raw-materials.module';
import { LotsModule } from './modules/product-and-inventory/lots/lots.module';
import { PackagingOrdersModule } from './modules/product-and-inventory/packaging-orders/packaging-orders.module';
import { PriceListItemsModule } from './modules/product-and-inventory/price-list-items/price-list-items.module';
import { ProcessingStagesModule } from './modules/product-and-inventory/processing-stages/processing-stages.module';
import { ProductCategoriesModule } from './modules/product-and-inventory/product-categories/product-categories.module';
import { ProductionOrderStagesModule } from './modules/product-and-inventory/production-order-stages/production-order-stages.module';
import { ProductionOrdersModule } from './modules/product-and-inventory/production-orders/production-orders.module';
import { ProductsModule } from './modules/product-and-inventory/products/products.module';
import { WarehousesModule } from './modules/product-and-inventory/warehouses/warehouses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironment,
      load: [databaseConfig],
    }),

    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // The "database" key corresponds to what you registered in database.config.ts
        return configService.get('database');
      },
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    CompaniesModule,
    CompanyOwnersModule,
    PartnersModule,
    EmployeesModule,
    UomModule,
    AccountsModule,
    CurrenciesModule,
    ExchangeRatesModule,
    JournalModule,
    PriceListsModule,
    SuppliersModule,
    CustomersModule,
    TradersModule,
    BrokersModule,
    BrokerageAgreementsModule,
    BrokerageTransactionsModule,
    ContactsModule,
    InventoryModule,
    InventoryMovementsModule,
    LotRawMaterialsModule,
    LotsModule,
    PackagingOrdersModule,
    PriceListItemsModule,
    ProcessingStagesModule,
    ProductCategoriesModule,
    ProductionOrderStagesModule,
    ProductionOrdersModule,
    ProductsModule,
    WarehousesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
