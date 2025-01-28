import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  company: {
    id: string;
    name: string;
    defaultCurrency: string;
  };

  @ApiProperty({ nullable: true })
  category: {
    id: string;
    categoryName: string;
  };

  @ApiProperty()
  productName: string;

  @ApiProperty({ nullable: true })
  sku?: string;

  @ApiProperty({ nullable: true })
  productType?: string;

  @ApiProperty({ nullable: true })
  unitOfMeasure: {
    id: string;
    uomName: string;
  };

  @ApiProperty()
  costPrice: number;

  @ApiProperty()
  sellingPrice: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ nullable: true })
  lot: {
    id: string;
    lotNumber: string;
  };

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
