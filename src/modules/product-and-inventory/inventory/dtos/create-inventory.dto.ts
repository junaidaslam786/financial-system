import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsOptional, Min, IsString, IsDateString } from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Company ID' })
  @IsUUID()
  companyId: string;

  @ApiPropertyOptional({ example: 'warehouse-uuid', description: 'Warehouse ID (nullable)' })
  @IsOptional()
  @IsUUID()
  warehouseId?: string;

  @ApiPropertyOptional({ example: 'product-uuid', description: 'Product ID (nullable)' })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiPropertyOptional({ example: 100.0, description: 'quantity >= 0' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @ApiPropertyOptional({ example: 'BATCH-001' })
  @IsOptional()
  @IsString()
  batchNumber?: string;

  @ApiPropertyOptional({ example: '2025-12-31', description: 'Expiration date in YYYY-MM-DD' })
  @IsOptional()
  @IsDateString()
  expirationDate?: string;
}
