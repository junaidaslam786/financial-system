import { PartialType } from '@nestjs/mapped-types';
import { CreatePriceListItemDto } from './create-price-list-item.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, Min, IsOptional } from 'class-validator';

export class UpdatePriceListItemDto extends PartialType(CreatePriceListItemDto) {
  @ApiPropertyOptional({ example: 120.00 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}
