import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsPaymentsService } from './transactions-payments.service';
import { TransactionsPaymentsController } from './transactions-payments.controller';
import { TransactionsPayment } from './entities/transactions-payments.entity';
import { PaymentMethod } from '../payment-methods/entities/payment-methods.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionsPayment, PaymentMethod])],
  providers: [TransactionsPaymentsService],
  controllers: [TransactionsPaymentsController],
  exports: [TransactionsPaymentsService],
})
export class TransactionsPaymentsModule {}
