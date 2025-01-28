import { ApiProperty } from '@nestjs/swagger';

export class LotResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  company: {
    id: string;
    name: string;
    defaultCurrency: string;
  };

  @ApiProperty()
  lotNumber: string;

  @ApiProperty({ nullable: true })
  sourceSupplier: {
    id: string;
    supplierName: string;
    contactInfo: string;
  };

  @ApiProperty({ nullable: true })
  product?: {
    id: string;
    productName: string;
    productType: string;
  };

  @ApiProperty()
  initialQuantity: number;

  @ApiProperty()
  currentQuantity: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
