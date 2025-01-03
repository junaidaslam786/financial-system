import { PartialType } from '@nestjs/mapped-types';
import { CreateProductionOrderDto } from './create-production-order.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsIn, IsDateString } from 'class-validator';

export class UpdateProductionOrderDto extends PartialType(CreateProductionOrderDto) {
  @ApiPropertyOptional({ example: 'Closed' })
  @IsOptional()
  @IsIn(['Open','In-Progress','Completed','Closed'])
  status?: string;

  @ApiPropertyOptional({ example: '2025-01-06T18:00:00Z' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
