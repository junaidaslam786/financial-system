import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackagingOrdersService } from './packaging-orders.service';
import { PackagingOrdersController } from './packaging-orders.controller';
import { PackagingOrderEntity } from './entities/packaging-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PackagingOrderEntity])],
  controllers: [PackagingOrdersController],
  providers: [PackagingOrdersService],
  exports: [PackagingOrdersService],
})
export class PackagingOrdersModule {}
