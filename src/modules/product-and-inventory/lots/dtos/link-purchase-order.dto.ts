import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsArray, IsOptional } from 'class-validator';

export class LinkPurchaseOrderDto {
  @ApiProperty({ description: 'UUID of the Purchase Order to link' })
  @IsUUID()
  purchaseOrderId: string;

  @ApiPropertyOptional({ description: 'Array of PO line UUIDs to link', type: [String] })
  @IsArray()
  @IsOptional()
  lineIds?: string[];
}