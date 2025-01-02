import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  companyId: string;

  @ApiProperty({ example: 'Acme Customer' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: 'Contact info for the customer' })
  @IsOptional()
  contactInfo?: string;

  @ApiProperty({ example: 'B2B', description: 'customerType might be B2B, Retail, etc.' })
  @IsOptional()
  @IsString()
  customerType?: string;

  @ApiProperty({ example: 10000.0, description: 'Credit limit >= 0' })
  @IsOptional()
  @IsNumber()
  creditLimit?: number;

  @ApiProperty({ example: 'Net 15' })
  @IsOptional()
  paymentTerms?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  defaultPriceListId?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Account ID' })
  @IsOptional()
  @IsUUID()
  accountId?: string;
}
