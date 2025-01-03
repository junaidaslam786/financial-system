import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsNumber, Min, IsString } from 'class-validator';

export class CreateWarehouseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Company ID' })
  @IsUUID()
  companyId: string;

  @ApiPropertyOptional({ example: 'Downtown Storage' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 1000, description: 'Capacity >= 0' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  capacity?: number;
}
