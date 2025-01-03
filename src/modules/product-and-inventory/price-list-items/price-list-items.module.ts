import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceListItemsService } from './price-list-items.service';
import { PriceListItemsController } from './price-list-items.controller';
import { PriceListItemEntity } from './entities/price-list-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PriceListItemEntity])],
  controllers: [PriceListItemsController],
  providers: [PriceListItemsService],
  exports: [PriceListItemsService],
})
export class PriceListItemsModule {}
