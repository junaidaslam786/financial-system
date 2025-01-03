import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotRawMaterialEntity } from './entities/lot-raw-material.entity';
import { LotRawMaterialsService } from './lot-raw-materials.service';
import { LotRawMaterialsController } from './lot-raw-materials.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LotRawMaterialEntity])],
  controllers: [LotRawMaterialsController],
  providers: [LotRawMaterialsService],
  exports: [LotRawMaterialsService],
})
export class LotRawMaterialsModule {}
