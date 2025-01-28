import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionOrdersService } from './production-orders.service';
import { ProductionOrdersController } from './production-orders.controller';
import { ProductionOrderEntity } from './entities/production-order.entity';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductionOrderEntity]), UsersModule],
  controllers: [ProductionOrdersController],
  providers: [ProductionOrdersService],
  exports: [ProductionOrdersService],
})
export class ProductionOrdersModule {}
