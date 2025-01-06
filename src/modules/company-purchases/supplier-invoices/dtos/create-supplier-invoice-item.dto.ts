import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateSupplierInvoiceItemDto {
  @ApiProperty({ description: 'UUID of the product', required: false })
  @IsUUID()
  @IsOptional()
  productId?: string;

  @ApiProperty({ description: 'Quantity invoiced', example: 10 })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({ description: 'Unit price', example: 10.0 })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiProperty({ description: 'Discount amount', example: 0, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @ApiProperty({ description: 'Tax rate in %', example: 5.0, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  taxRate?: number;
}
