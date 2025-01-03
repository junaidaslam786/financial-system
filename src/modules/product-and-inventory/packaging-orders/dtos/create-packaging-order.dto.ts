import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsNumber, Min, IsInt, IsString, IsIn } from 'class-validator';

export class CreatePackagingOrderDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Company ID' })
  @IsUUID()
  companyId: string;

  @ApiPropertyOptional({ example: '789e0123-e89b-12d3-a456-426614174999', description: 'Production Order ID' })
  @IsOptional()
  @IsUUID()
  productionOrderId?: string;

  @ApiPropertyOptional({ example: 'PKO-001', description: 'Unique packaging order number' })
  @IsOptional()
  @IsString()
  orderNumber?: string;

  @ApiPropertyOptional({ example: 1000.0, description: 'total_quantity >= 0' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalQuantity?: number;

  @ApiPropertyOptional({ example: 50.0, description: 'bag_weight >= 0' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bagWeight?: number;

  @ApiPropertyOptional({ example: 20, description: 'number_of_bags >= 0' })
  @IsOptional()
  @IsInt()
  @Min(0)
  numberOfBags?: number;

  @ApiPropertyOptional({ example: 'Pending', enum: ['Pending','In-Progress','Completed'] })
  @IsOptional()
  @IsString()
  @IsIn(['Pending','In-Progress','Completed'])
  status?: string;
}
