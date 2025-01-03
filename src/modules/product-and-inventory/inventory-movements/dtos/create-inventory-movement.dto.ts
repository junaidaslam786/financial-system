import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsIn, IsNumber, Min, IsOptional, IsString } from 'class-validator';

export class CreateInventoryMovementDto {
  @ApiProperty({ example: 'company-uuid', description: 'Company ID' })
  @IsUUID()
  companyId: string;

  @ApiPropertyOptional({ example: 'inventory-uuid', description: 'Inventory ID (nullable)' })
  @IsOptional()
  @IsUUID()
  inventoryId?: string;

  @ApiPropertyOptional({ example: 'IN', enum: ['IN','OUT','ADJUSTMENT'] })
  @IsOptional()
  @IsString()
  @IsIn(['IN','OUT','ADJUSTMENT'])
  movementType?: string;

  @ApiPropertyOptional({ example: 100.0, description: 'quantity >= 0' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @ApiPropertyOptional({ example: 'Adjustment reason / restocking note' })
  @IsOptional()
  @IsString()
  reason?: string;
}
