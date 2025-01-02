import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { SupplierEntity } from './entities/supplier.entity';
import { Account } from 'src/modules/financial/accounts/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierEntity, Account])],
  controllers: [SuppliersController],
  providers: [SuppliersService],
  exports: [SuppliersService],
})
export class SuppliersModule {}
