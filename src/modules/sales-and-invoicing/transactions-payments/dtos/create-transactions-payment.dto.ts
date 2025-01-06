import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionsPaymentDto {
  @ApiProperty({ description: 'ID of the related transaction (invoice, order, etc.)', required: false })
  relatedTransactionId?: string;

  @ApiProperty({ description: 'Payment method ID', required: false })
  paymentMethodId?: string;

  @ApiProperty({ description: 'Payment amount', example: 300.0 })
  amount: number;

  @ApiProperty({ description: 'Payment date', example: '2025-01-06' })
  paymentDate?: Date;
}
