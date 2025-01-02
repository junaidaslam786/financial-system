import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { CustomerEntity } from './entities/customer.entity';
import { Account } from 'src/modules/financial/accounts/entities/account.entity';
import { PriceList } from 'src/modules/financial/price-lists/entities/price-list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity, Account, PriceList])],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
