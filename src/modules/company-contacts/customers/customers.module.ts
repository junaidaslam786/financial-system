import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { CustomerEntity } from './entities/customer.entity';
import { Account } from 'src/modules/financial/accounts/entities/account.entity';
import { PriceList } from 'src/modules/financial/price-lists/entities/price-list.entity';
import { ContactsModule } from '../contacts/contacts.module';
import { PriceListsModule } from 'src/modules/financial/price-lists/price-lists.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity, Account, PriceList]),
    ContactsModule,
    PriceListsModule,
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
