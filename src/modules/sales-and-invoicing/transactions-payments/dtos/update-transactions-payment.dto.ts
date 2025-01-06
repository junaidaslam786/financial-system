import { PartialType } from '@nestjs/swagger';
import { CreateTransactionsPaymentDto } from './create-transactions-payment.dto';

export class UpdateTransactionsPaymentDto extends PartialType(CreateTransactionsPaymentDto) {}
