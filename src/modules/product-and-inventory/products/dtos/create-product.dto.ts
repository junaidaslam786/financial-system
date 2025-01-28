import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsNumber, Min, IsIn } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Company ID' })
  @IsUUID()
  companyId: string;

  @ApiPropertyOptional({ example: '789e0123-e89b-12d3-a456-426614174999', description: 'Category ID' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiProperty({ example: 'Rice Flour' })
  @IsString()
  productName: string;

  @ApiPropertyOptional({ example: 'SKU-1234', description: 'Unique SKU code' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ example: 'FinishedGood', enum: ['RawMaterial','FinishedGood','Service'] })
  @IsOptional()
  @IsString()
  @IsIn(['RawMaterial','FinishedGood','Service'])
  productType?: string;

  @ApiPropertyOptional({ example: '456e7890-e89b-12d3-a456-426614174aaa', description: 'UOM ID' })
  @IsOptional()
  @IsUUID()
  unitOfMeasureId?: string;

  @ApiPropertyOptional({ example: 10.50, description: 'Cost price >= 0' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  costPrice?: number;

  @ApiPropertyOptional({ example: 15.00, description: 'Selling price >= 0' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sellingPrice?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({example:'789e0123-e89b-12d3-a456-426614174999', description: 'lot'})
  @IsOptional()
  @IsUUID()
  lotId?: string;
}
