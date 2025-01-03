import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsIn, IsDateString } from 'class-validator';

export class CreateProductionOrderDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Company ID' })
  @IsUUID()
  companyId: string;

  @ApiProperty({ example: 'abc123-...', description: 'Lot ID' })
  @IsUUID()
  lotId: string;

  @ApiProperty({ example: 'PO-001', description: 'Unique order number' })
  @IsString()
  orderNumber: string;

  @ApiPropertyOptional({ example: '2025-01-01T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  startDate?: string; // or Date

  @ApiPropertyOptional({ example: '2025-01-05T18:00:00Z' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: 'Open', enum: ['Open','In-Progress','Completed','Closed'] })
  @IsOptional()
  @IsString()
  @IsIn(['Open','In-Progress','Completed','Closed'])
  status?: string;
}
