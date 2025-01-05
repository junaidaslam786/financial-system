import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateInvoiceItemDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  unitPrice: number;

  @ApiProperty()
  @IsOptional()
  discount: number;

  @ApiProperty()
  @IsOptional()
  taxRate: number;

  @ApiProperty()
  @IsOptional()
  description?: string;
}

export class CreateInvoiceDto {
  @ApiProperty()
  @IsString()
  companyId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  brokerId?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  invoiceDate?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty()
  @IsString()
  invoiceNumber: string;

  @ApiProperty({ type: [CreateInvoiceItemDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items: CreateInvoiceItemDto[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  termsAndConditions?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  notes?: string;
}
