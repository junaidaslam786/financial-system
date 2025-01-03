import { PartialType } from '@nestjs/mapped-types';
import { CreatePackagingOrderDto } from './create-packaging-order.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsIn, IsNumber, Min, IsInt } from 'class-validator';

export class UpdatePackagingOrderDto extends PartialType(CreatePackagingOrderDto) {
  @ApiPropertyOptional({ example: 'In-Progress' })
  @IsOptional()
  @IsIn(['Pending','In-Progress','Completed'])
  status?: string;

  @ApiPropertyOptional({ example: 1200 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalQuantity?: number;

  @ApiPropertyOptional({ example: 40 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bagWeight?: number;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsInt()
  @Min(0)
  numberOfBags?: number;
}
