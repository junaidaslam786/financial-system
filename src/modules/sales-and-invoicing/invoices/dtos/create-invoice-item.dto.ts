import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  Min,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { InvoiceLineType } from '../enums/invoice-line-type.enum';

export class CreateInvoiceItemDto {

  @ApiProperty({ enum: InvoiceLineType, default: InvoiceLineType.PRODUCT })
  @IsEnum(InvoiceLineType)
  lineType: InvoiceLineType;

  @ApiProperty({ description: 'UUID of the product' })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiProperty({ description: 'Quantity of the product', example: 10 })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({ description: 'Unit price of the product', example: 50.0 })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiProperty({ description: 'Discount amount', required: false, example: 5.0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @ApiProperty({ description: 'Tax rate in percentage', required: false, example: 10.0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  taxRate?: number;

  @ApiProperty({ description: 'Optional description for the line item', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
