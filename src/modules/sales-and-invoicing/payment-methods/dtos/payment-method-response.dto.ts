import { ApiProperty } from '@nestjs/swagger';

export class PaymentMethodResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  company: {
    id: string;
    name: string;
    defaultCurrency: string;
  };

  @ApiProperty()
  methodName: string;

  @ApiProperty({ required: false })
  details?: string;

  @ApiProperty()
  createdAt: Date;
}
