import { IsString, IsNumber, Min, IsOptional } from 'class-validator';

export class SalesOrderLineDto {
  @IsString()
  productId: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  taxRate?: number;
}
