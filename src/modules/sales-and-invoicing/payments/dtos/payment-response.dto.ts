import { ApiProperty } from '@nestjs/swagger';

export class PaymentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  companyId: string;

  @ApiProperty({ required: false })
  invoiceId?: string;

  @ApiProperty()
  paymentDate: Date;

  @ApiProperty()
  amount: number;

  @ApiProperty({ required: false })
  paymentMethod?: string;

  @ApiProperty({ required: false })
  reference?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
