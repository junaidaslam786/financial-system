import { ApiProperty } from '@nestjs/swagger';

export class AccountResponseDto {
  @ApiProperty({ description: 'UUID of the account' })
  id: string;

  @ApiProperty({ description: 'Name of the account' })
  accountName: string;

  @ApiProperty({ description: 'Type of the account' })
  accountType: string;

  @ApiProperty({
    description: 'UUID of the parent account if nested',
    required: false,
  })
  parentAccountId?: string;

  @ApiProperty({
    description: 'Currency code for this account (if applicable)',
    required: false,
  })
  currency?: string;

  @ApiProperty({ description: 'Initial balance of the account' })
  initialBalance: number;

  @ApiProperty({
    description: 'Indicates if the initial balance is DEBIT or CREDIT',
    required: false,
    enum: ['DEBIT', 'CREDIT'],
  })
  initialBalanceType?: 'DEBIT' | 'CREDIT';

  @ApiProperty({ description: 'Timestamp when the account was created' })
  createdAt: Date;

  @ApiProperty({ description: 'Timestamp when the account was last updated' })
  updatedAt: Date;
}
