import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrokerageTransactionsService } from './brokerage-transactions.service';
import { BrokerageTransactionsController } from './brokerage-transactions.controller';
import { BrokerageTransactionEntity } from './entities/brokerage-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BrokerageTransactionEntity])],
  controllers: [BrokerageTransactionsController],
  providers: [BrokerageTransactionsService],
  exports: [BrokerageTransactionsService],
})
export class BrokerageTransactionsModule {}
