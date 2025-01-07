import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsString,
  IsDateString,
  IsOptional,
  IsIn,
  IsNumber,
  Min,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSupplierInvoiceItemDto } from './create-supplier-invoice-item.dto';

export class CreateSupplierInvoiceDto {
  @ApiProperty({ description: 'UUID of the company' })
  @IsUUID()
  companyId: string;

  @ApiPropertyOptional({ description: 'Link to a purchase order (optional)' })
  @IsOptional()
  @IsUUID()
  purchaseOrderId?: string;

  @ApiProperty({ description: 'UUID of the supplier', required: false })
  @IsUUID()
  @IsOptional()
  supplierId?: string;

  @ApiProperty({ description: 'UUID of the broker', required: false })
  @IsUUID()
  @IsOptional()
  brokerId?: string;

  @ApiProperty({ description: 'Unique invoice number', example: 'INV-0001' })
  @IsString()
  invoiceNumber: string;

  @ApiProperty({ description: 'Invoice date', required: false })
  @IsOptional()
  @IsDateString()
  invoiceDate?: string;

  @ApiProperty({ description: 'Due date', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ description: 'Total amount (if known upfront)', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalAmount?: number;

  @ApiProperty({ description: 'Currency code', required: false })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({
    description: 'Status of the invoice',
    enum: ['Unpaid','Paid','Partially Paid','Cancelled'],
    required: false,
  })
  @IsOptional()
  @IsIn(['Unpaid','Paid','Partially Paid','Cancelled'])
  status?: string;

  @ApiProperty({
    type: () => [CreateSupplierInvoiceItemDto],
    description: 'Optional array of items to create with the invoice',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSupplierInvoiceItemDto)
  @IsOptional()
  items?: CreateSupplierInvoiceItemDto[];
}
