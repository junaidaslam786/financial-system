import { ApiProperty } from '@nestjs/swagger';
import { InvoiceLineType } from '../enums/invoice-line-type.enum';

export class InvoiceItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  product: {
    id: string;
    productName: string;
    productType: string;
  };

  @ApiProperty()
  lineType: InvoiceLineType;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  taxRate: number;

  @ApiProperty()
  totalPrice: number;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
