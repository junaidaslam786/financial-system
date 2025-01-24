import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsArray, IsOptional } from 'class-validator';

export class LinkInvoiceDto {
  @ApiProperty({ description: 'UUID of the Invoice to link' })
  @IsUUID()
  invoiceId: string;

  @ApiPropertyOptional({ description: 'Array of invoice item UUIDs to link', type: [String] })
  @IsArray()
  @IsOptional()
  itemIds?: string[];
}