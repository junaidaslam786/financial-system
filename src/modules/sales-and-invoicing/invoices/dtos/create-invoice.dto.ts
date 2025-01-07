import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDateString,
  ValidateNested,
  IsUUID,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateInvoiceItemDto } from './create-invoice-item.dto';

export class CreateInvoiceDto {
  @ApiProperty({ description: 'UUID of the company issuing this invoice' })
  @IsUUID()
  companyId: string;

  @ApiPropertyOptional({ description: 'Link to a sales order (optional)' })
  @IsOptional()
  @IsUUID()
  salesOrderId?: string; 

  @ApiProperty({ description: 'UUID of the customer', required: false })
  @IsUUID()
  @IsOptional()
  customerId?: string;

  @ApiProperty({ description: 'UUID of the broker', required: false })
  @IsUUID()
  @IsOptional()
  brokerId?: string;

  @ApiProperty({ description: 'Invoice date', required: false })
  @IsOptional()
  @IsDateString()
  invoiceDate?: string;

  @ApiProperty({ description: 'Due date of the invoice', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ description: 'Unique invoice number' })
  @IsString()
  invoiceNumber: string;

  @ApiProperty({
    type: [CreateInvoiceItemDto],
    description: 'Array of line items for this invoice',
  })
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  @IsArray()
  @ArrayNotEmpty()
  items: CreateInvoiceItemDto[];

  @ApiProperty({ description: 'Invoice terms and conditions', required: false })
  @IsString()
  @IsOptional()
  termsAndConditions?: string;

  @ApiProperty({ description: 'Any additional notes for the invoice', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
