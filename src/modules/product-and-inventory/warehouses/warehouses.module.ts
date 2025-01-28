import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehousesService } from './warehouses.service';
import { WarehousesController } from './warehouses.controller';
import { WarehouseEntity } from './entities/warehouse.entity';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseEntity]), UsersModule],
  controllers: [WarehousesController],
  providers: [WarehousesService],
  exports: [WarehousesService],
})
export class WarehousesModule {}
