import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Company ID making the payment' })
  companyId: string;

  @ApiProperty({ description: 'Invoice ID being paid', required: false })
  invoiceId?: string;

  @ApiProperty({ description: 'Payment date', example: '2025-01-06' })
  paymentDate?: Date;

  @ApiProperty({ description: 'Payment amount', example: 500.0 })
  amount: number;

  @ApiProperty({ description: 'Payment method', required: false, example: 'Bank Transfer' })
  paymentMethod?: string;

  @ApiProperty({ description: 'Reference or note for payment', required: false })
  reference?: string;
}
