import { ApiProperty } from '@nestjs/swagger';

export class InventoryMovementResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  company: {
    id: string;
    name: string;
    defaultCurrency: string;
  };

  @ApiProperty({ nullable: true })
  inventory: {
    id: string;
    quantity: number;
    batchNumber: string;
    expirationDate: string | Date;
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
  };

  @ApiProperty({ nullable: true })
  movementType?: string;

  @ApiProperty({ nullable: true })
  quantity?: number;

  @ApiProperty({ nullable: true })
  reason?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
