import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min, IsOptional } from 'class-validator';

export class CreatePurchaseOrderLineDto {
  @ApiProperty({ description: 'UUID of the product', required: false })
  @IsUUID()
  @IsOptional()
  productId?: string;

  @ApiProperty({ description: 'Quantity ordered', example: 10 })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({ description: 'Unit price', example: 5.99 })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiProperty({ description: 'Discount amount', example: 1.0, required: false })
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
