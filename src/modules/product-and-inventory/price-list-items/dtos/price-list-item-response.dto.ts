import { ApiProperty } from '@nestjs/swagger';

export class PriceListItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  priceList: {  
    id: string;
    listName: string;
    currency: string;
  };

  @ApiProperty()
  product: {
    id: string;
    productName: string;
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

  };

  @ApiProperty()
  price: number;
}
