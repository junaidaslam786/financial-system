import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  companyId: string;

  @ApiProperty({ nullable: true })
  categoryId?: string;

  @ApiProperty()
  productName: string;

  @ApiProperty({ nullable: true })
  sku?: string;

  @ApiProperty({ nullable: true })
  productType?: string;

  @ApiProperty({ nullable: true })
  unitOfMeasureId?: string;

  @ApiProperty()
  costPrice: number;

  @ApiProperty()
  sellingPrice: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
