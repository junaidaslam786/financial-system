import { ApiProperty } from '@nestjs/swagger';

export class TransactionsPaymentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  relatedTransactionId?: string;

  @ApiProperty({ required: false })
  paymentMethodId?: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  paymentDate: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
