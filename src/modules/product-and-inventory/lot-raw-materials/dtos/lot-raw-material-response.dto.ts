import { ApiProperty } from '@nestjs/swagger';

export class LotRawMaterialResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  lot: {
    id: string;
    lotNumber: string;
    currentQuantity: number;
    status: string;
  };

  @ApiProperty()
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
}
