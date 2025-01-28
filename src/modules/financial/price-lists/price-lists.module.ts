import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceList } from './entities/price-list.entity';
import { PriceListsService } from './price-lists.service';
import { PriceListsController } from './price-lists.controller';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([PriceList]), UsersModule],
  controllers: [PriceListsController],
  providers: [PriceListsService],
  exports: [PriceListsService],
})
export class PriceListsModule {}
