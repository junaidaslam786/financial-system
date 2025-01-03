import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min } from 'class-validator';

export class CreatePriceListItemDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  priceListId: string;

  @ApiProperty({ example: '789e0123-e89b-12d3-a456-426614174999' })
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 100.00, description: 'Price >= 0' })
  @IsNumber()
  @Min(0)
  price: number;
}
