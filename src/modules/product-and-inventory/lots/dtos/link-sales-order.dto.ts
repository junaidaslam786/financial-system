import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsArray, IsOptional } from 'class-validator';

export class LinkSalesOrderDto {
  @ApiProperty({ description: 'UUID of the Sales Order to link' })
  @IsUUID()
  salesOrderId: string;

  @ApiPropertyOptional({ description: 'Array of sales-order line UUIDs to link', type: [String] })
  @IsArray()
  @IsOptional()
  lineIds?: string[];
}