// uom.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UomController } from './uom.controller';
import { UomService } from './uom.service';
import { UnitOfMeasureEntity } from './entities/unit-of-measure.entity';
import { Company } from '../companies/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UnitOfMeasureEntity, Company])],
  controllers: [UomController],
  providers: [UomService],
  exports: [UomService],
})
export class UomModule {}
