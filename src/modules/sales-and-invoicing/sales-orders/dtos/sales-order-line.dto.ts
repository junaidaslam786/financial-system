import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, Min, IsOptional, IsUUID } from 'class-validator';

export class SalesOrderLineDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' }) 
  @IsString()
  productId: string;

  @ApiPropertyOptional({ description: 'Lot ID if linking raw material to a lot' })
  @IsUUID()
  @IsOptional()
  lotId?: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  taxRate?: number;
}
