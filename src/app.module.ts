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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
