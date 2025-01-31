import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DayBookResponseDto {
  @ApiProperty({ description: 'Start date of the daybook query range' })
  startDate: string;

  @ApiProperty({ description: 'End date of the daybook query range' })
  endDate: string;

  @ApiProperty({ description: 'List of day book entries (or aggregated data)' })
  data: DayBookEntryDto[] | DayBookAggregatedDto[];
}

/**
 * For a detailed listing of each journal entry
 */
export class DayBookEntryDto {
  @ApiProperty()
  journalEntry: {
    id: string;
    reference: string;
    description: string;
    entryDate: string;
    createdBy: {
      id: string;
      username: string
    };
    lines: {
      accountId: string;
      account: {
        id: string;
        accountName: string;
        accountType: string;
      };
      debit: number;
      credit: number;
    }[];
  };

  @ApiProperty()
  reference?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  entryDate: string; // e.g. '2025-01-01'

  @ApiProperty({ description: 'Array of lines' })
  lines: {
    accountId: string;
    account?: { // Optional: Include the full account object
      id: string;
      accountName: string;
      accountType: string;
    };
    debit: number;
    credit: number;
  }[];
}

/**
 * For an aggregated approach
 */
export class DayBookAggregatedDto {
  @ApiProperty()
  date: string;

  @ApiProperty()
  accountId: string;

  @ApiProperty({ description: 'Sum of debits for this date+account' })
  totalDebit: number;

  @ApiProperty({ description: 'Sum of credits for this date+account' })
  totalCredit: number;

  @ApiPropertyOptional({ description: 'The full account object (optional)' })
  account?: {
    id: string;
    accountName: string;
    accountType: string;
    // ...
  };
}
