import { ApiProperty } from '@nestjs/swagger';

export class PaymentMethodResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  companyId: string;

  @ApiProperty()
  methodName: string;

  @ApiProperty({ required: false })
  details?: string;

  @ApiProperty()
  createdAt: Date;
}
