import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { SupplierEntity } from './entities/supplier.entity';
import { Account } from 'src/modules/financial/accounts/entities/account.entity';
import { ContactsModule } from '../contacts/contacts.module';
import { PriceListsModule } from 'src/modules/financial/price-lists/price-lists.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupplierEntity, Account]),
    ContactsModule,
    PriceListsModule,
  ],
  controllers: [SuppliersController],
  providers: [SuppliersService],
  exports: [SuppliersService],
})
export class SuppliersModule {}
