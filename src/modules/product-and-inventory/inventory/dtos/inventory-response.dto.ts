import { ApiProperty } from '@nestjs/swagger';

export class InventoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  company: {
    id: string;
    name: string;
    defaultCurrency: string;
  };

  @ApiProperty({ nullable: true })
  warehouse: {
    id: string;
    location: string;
    capacity: number;
  };

  @ApiProperty({ nullable: true })
  product: {
    id: string;
    productName: string;
    productType: string;
    sku: string;
    category: {
      id: string;
      categoryName: string;
    };
    unitOfMeasure: {
      id: string;
      uomName: string;
    };
    costPrice: number;
    sellingPrice: number;
    defaultCurrency: string;
  };

  @ApiProperty()
  quantity: number;

  @ApiProperty({ nullable: true })
  batchNumber?: string;

  @ApiProperty({ nullable: true })
  expirationDate?: string | Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
