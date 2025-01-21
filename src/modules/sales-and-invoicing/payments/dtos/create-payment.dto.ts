import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Company ID making the payment' })
  @IsOptional()
  @IsUUID()
  companyId: string;

  @ApiProperty({ description: 'Invoice ID being paid', required: false }
  )
  @IsOptional()
  @IsUUID()
  invoiceId?: string;

  @ApiProperty({ description: 'Payment date', example: '2025-01-06' })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  paymentDate?: Date;

  @ApiProperty({ description: 'Payment amount', example: 500.0 })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Payment method', required: false, example: 'Bank Transfer' })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiProperty({ description: 'Reference or note for payment', required: false })
  @IsOptional()
  @IsUUID()
  journalEntryId?: string;
}
