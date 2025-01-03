import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsNumber, Min, IsDateString, IsString } from 'class-validator';

export class CreateProductionOrderStageDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Production Order ID' })
  @IsUUID()
  productionOrderId: string;

  @ApiProperty({ example: '789e0123-e89b-12d3-a456-426614174999', description: 'Processing Stage ID' })
  @IsUUID()
  processingStageId: string;

  @ApiPropertyOptional({ example: '2025-01-01T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiPropertyOptional({ example: '2025-01-01T14:00:00Z' })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiPropertyOptional({ example: 100.0, description: 'Input quantity >= 0' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  inputQuantity?: number;

  @ApiPropertyOptional({ example: 90.0, description: 'Output quantity >= 0' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  outputQuantity?: number;

  @ApiPropertyOptional({ example: 'Some notes or observations' })
  @IsOptional()
  @IsString()
  notes?: string;
}
