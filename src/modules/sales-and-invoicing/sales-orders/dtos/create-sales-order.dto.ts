import { IsString, IsOptional, IsDateString, IsArray, ValidateNested, IsBoolean, IsDate, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { SalesOrderLineDto } from './sales-order-line.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSalesOrderDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  companyId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsOptional()
  customerId?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsOptional()
  traderId?: string;

  @ApiProperty({ example: 'SO-0001' })
  @IsString()
  orderNumber: string;

  @ApiProperty({ example: '2021-08-01' })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  orderDate?: Date;

  @ApiProperty({ example: 'false' })
  @IsOptional()
  @IsBoolean()
  autoInvoicing?: boolean;

  @ApiProperty({ example: 'Pending' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 1000.0 })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsOptional()
  brokerId?: string;

  @ApiProperty({ type: SalesOrderLineDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SalesOrderLineDto)
  lines: SalesOrderLineDto[];
}
