// uom.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UomController } from './uom.controller';
import { UomService } from './uom.service';
import { UnitOfMeasureEntity } from './entities/unit-of-measure.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UnitOfMeasureEntity])],
  controllers: [UomController],
  providers: [UomService],
  exports: [UomService],
})
export class UomModule {}
