import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDateString,
  ValidateNested,
  IsUUID,
  IsArray,
  ArrayNotEmpty,
  IsEnum,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateInvoiceItemDto } from './create-invoice-item.dto';

export class CreateInvoiceDto {
  @ApiProperty({ description: 'UUID of the company issuing this invoice' })
  @IsUUID()
  companyId: string;

  @ApiProperty({ description: 'Type of invoice (Purchase or Sale)' })
  @IsEnum(['Purchase','Sale'])
  invoiceType: 'Purchase' | 'Sale';

  @ApiPropertyOptional({ description: 'Link to a sales order (optional)' })
  @IsOptional()
  @IsUUID()
  salesOrderId?: string; 

  @ApiPropertyOptional({ description: 'Link to a purchase order (optional)' })
  @IsOptional()
  @IsUUID()
  purchaseOrderId?: string;

  @ApiPropertyOptional({description: 'UUID of the supplier (optional)'})
  @IsUUID()
  @IsOptional()
  supplierId?: string;

  @ApiProperty({ description: 'UUID of the customer', required: false })
  @IsUUID()
  @IsOptional()
  customerId?: string;

  @ApiProperty({ description: 'UUID of the broker', required: false })
  @IsUUID()
  @IsOptional()
  brokerId?: string;

  @ApiProperty({ description: 'Invoice date', required: false })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  invoiceDate?: string;

  @ApiProperty({ description: 'Due date of the invoice', required: false })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
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

  @IsOptional() @IsString()
  currency?: string;

  @IsOptional() @IsString()
  status?: string; // 'Unpaid','Paid','Partially Paid','Cancelled'


  @ApiProperty({ description: 'Any additional notes for the invoice', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
