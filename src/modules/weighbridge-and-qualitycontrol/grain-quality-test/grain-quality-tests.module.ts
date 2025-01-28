import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrainQualityTestsService } from './grain-quality-tests.service';
import { GrainQualityTestsController } from './grain-quality-tests.controller';
import { GrainQualityTest } from './entities/grain-quality-test.entity';
import { LotEntity } from 'src/modules/product-and-inventory/lots/entities/lot.entity';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GrainQualityTest,
      LotEntity,
    ]),
    UsersModule
  ],
  controllers: [GrainQualityTestsController],
  providers: [GrainQualityTestsService],
  exports: [GrainQualityTestsService],
})
export class GrainQualityTestsModule {}
