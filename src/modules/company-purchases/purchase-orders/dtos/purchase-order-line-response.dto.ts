import { ApiProperty } from '@nestjs/swagger';

export class PurchaseOrderLineResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  product: {
    id: string;
    productName: string;
    productType: string;
  };

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  taxRate: number;

  @ApiProperty()
  totalLineAmount: number;
}
