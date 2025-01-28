import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsNumber, Min, IsOptional, IsIn } from 'class-validator';

export class CreateLotDto {
  @ApiProperty({ example: 'abc123-...', description: 'Company ID' })
  @IsUUID()
  companyId: string;

  @ApiProperty({ example: 'LOT-001', description: 'Unique lot number' })
  @IsString()
  lotNumber: string;

  @ApiPropertyOptional({ example: 'xyz456-...', description: 'Supplier ID (optional)' })
  @IsOptional()
  @IsUUID()
  sourceSupplierId?: string;

  @ApiProperty({ example: 1000, description: 'Initial quantity >= 0' })
  @IsNumber()
  @Min(0)
  initialQuantity: number;

  @ApiProperty({ example: 1000, description: 'Current quantity >= 0' })
  @IsNumber()
  @Min(0)
  currentQuantity: number;

  @ApiPropertyOptional({ example: 'Pending', enum: ['Pending','In-Process','Completed'] })
  @IsOptional()
  @IsString()
  @IsIn(['Pending','In-Process','Completed'])
  status?: string;

  @ApiPropertyOptional({ description: 'ID of the product linked to this lot' })
  @IsUUID()
  @IsOptional()
  productId?: string;
}
