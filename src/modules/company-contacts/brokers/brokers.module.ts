import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrokersService } from './brokers.service';
import { BrokersController } from './brokers.controller';
import { BrokerEntity } from './entities/broker.entity';
import { Account } from 'src/modules/financial/accounts/entities/account.entity';
import { ContactsModule } from '../contacts/contacts.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([BrokerEntity, Account]), ContactsModule, UsersModule],
  controllers: [BrokersController],
  providers: [BrokersService],
  exports: [BrokersService],
})
export class BrokersModule {}
