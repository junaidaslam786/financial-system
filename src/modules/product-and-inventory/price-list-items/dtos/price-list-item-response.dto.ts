import { ApiProperty } from '@nestjs/swagger';

export class PriceListItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  priceListId: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  price: number;
}
