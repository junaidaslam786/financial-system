import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  Length,
  IsNumber,
  Min,
  IsEnum,
} from 'class-validator';
import { BalanceType } from 'src/common/enums/balace-type';

export class CreateAccountDto {
  @ApiProperty({ description: 'UUID of the company that owns this account' })
  @IsString()
  companyId: string; // or pass as part of route if you prefer

  @ApiProperty({ description: 'Name of the account', example: 'Cash on Hand' })
  @IsString()
  @Length(1, 255)
  accountName: string;

  @ApiProperty({
    description: 'Type of the account',
    example: 'ASSET',
  })
  @IsString()
  @Length(1, 100)
  accountType: string;

  @ApiProperty({
    description: 'UUID of the parent account (if nested under another account)',
    required: false,
  })
  @IsOptional()
  @IsString()
  parentAccountId?: string;

  @ApiProperty({
    description: 'Currency code for this account (e.g., USD, EUR)',
    example: 'USD',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 10)
  currency?: string;

  @ApiProperty({
    description: 'Initial balance for this account',
    example: 1000.0,
    required: false,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  initialBalance?: number; // default 0 if not provided

  @ApiProperty({
    description: 'Indicates whether the initial balance is a DEBIT or CREDIT',
    enum: BalanceType,
    required: false,
  })
  @IsOptional()
  @IsEnum(BalanceType)
  initialBalanceType?: BalanceType;
}
