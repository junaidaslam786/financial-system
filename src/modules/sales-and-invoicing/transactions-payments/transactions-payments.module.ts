import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsPaymentsService } from './transactions-payments.service';
import { TransactionsPaymentsController } from './transactions-payments.controller';
import { TransactionsPayment } from './entities/transactions-payments.entity';
import { PaymentMethod } from '../payment-methods/entities/payment-methods.entity';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionsPayment, PaymentMethod]), UsersModule],
  providers: [TransactionsPaymentsService],
  controllers: [TransactionsPaymentsController],
  exports: [TransactionsPaymentsService],
})
export class TransactionsPaymentsModule {}
