import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentMethodDto {
  @ApiProperty({ description: 'Company ID for which this method is defined' })
  companyId: string;

  @ApiProperty({ description: 'Name of the payment method', example: 'Credit Card' })
  methodName: string;

  @ApiProperty({ description: 'Additional details about the method', required: false })
  details?: string;
}
