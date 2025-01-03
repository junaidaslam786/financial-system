import { PartialType } from '@nestjs/mapped-types';
import { CreateProductionOrderStageDto } from './create-production-order-stage.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString, IsNumber, Min, IsString } from 'class-validator';

export class UpdateProductionOrderStageDto extends PartialType(CreateProductionOrderStageDto) {
  @ApiPropertyOptional({ example: '2025-01-02T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiPropertyOptional({ example: '2025-01-02T12:00:00Z' })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiPropertyOptional({ example: 120.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  inputQuantity?: number;

  @ApiPropertyOptional({ example: 115.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  outputQuantity?: number;

  @ApiPropertyOptional({ example: 'Updated notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
