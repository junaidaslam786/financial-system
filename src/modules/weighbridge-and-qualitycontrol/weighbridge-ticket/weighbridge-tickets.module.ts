import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeighbridgeTicketsService } from './weighbridge-tickets.service';
import { WeighbridgeTicketsController } from './weighbridge-tickets.controller';
import { WeighbridgeTicket } from './entities/weighbridge-ticket.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import { LotEntity } from 'src/modules/product-and-inventory/lots/entities/lot.entity';
import { UsersModule } from 'src/modules/users/users.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      WeighbridgeTicket,
      Company,
      LotEntity,
    ]),
    UsersModule
  ],
  controllers: [WeighbridgeTicketsController],
  providers: [WeighbridgeTicketsService],
  exports: [WeighbridgeTicketsService],
})
export class WeighbridgeTicketsModule {}
