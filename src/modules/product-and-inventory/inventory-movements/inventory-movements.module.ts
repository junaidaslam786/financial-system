import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryMovementsService } from './inventory-movements.service';
import { InventoryMovementsController } from './inventory-movements.controller';
import { InventoryMovementEntity } from './entities/inventory-movement.entity';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryMovementEntity]), UsersModule],
  controllers: [InventoryMovementsController],
  providers: [InventoryMovementsService],
  exports: [InventoryMovementsService],
})
export class InventoryMovementsModule {}
