import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotRawMaterialEntity } from './entities/lot-raw-material.entity';
import { LotRawMaterialsService } from './lot-raw-materials.service';
import { LotRawMaterialsController } from './lot-raw-materials.controller';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([LotRawMaterialEntity]), UsersModule],
  controllers: [LotRawMaterialsController],
  providers: [LotRawMaterialsService],
  exports: [LotRawMaterialsService],
})
export class LotRawMaterialsModule {}
