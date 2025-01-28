import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrokerageTransactionsService } from './brokerage-transactions.service';
import { BrokerageTransactionsController } from './brokerage-transactions.controller';
import { BrokerageTransactionEntity } from './entities/brokerage-transaction.entity';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([BrokerageTransactionEntity]), UsersModule],
  controllers: [BrokerageTransactionsController],
  providers: [BrokerageTransactionsService],
  exports: [BrokerageTransactionsService],
})
export class BrokerageTransactionsModule {}
