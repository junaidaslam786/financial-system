import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrokersService } from './brokers.service';
import { BrokersController } from './brokers.controller';
import { BrokerEntity } from './entities/broker.entity';
import { Account } from 'src/modules/financial/accounts/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BrokerEntity, Account])],
  controllers: [BrokersController],
  providers: [BrokersService],
  exports: [BrokersService],
})
export class BrokersModule {}
