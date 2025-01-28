import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionOrderStagesService } from './production-order-stages.service';
import { ProductionOrderStagesController } from './production-order-stages.controller';
import { ProductionOrderStageEntity } from './entities/production-order-stage.entity';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductionOrderStageEntity]), UsersModule],
  controllers: [ProductionOrderStagesController],
  providers: [ProductionOrderStagesService],
  exports: [ProductionOrderStagesService],
})
export class ProductionOrderStagesModule {}
