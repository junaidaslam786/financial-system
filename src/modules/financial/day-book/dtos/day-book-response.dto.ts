import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * For a detailed listing of each journal entry.
 */
export class DayBookEntryDto {
  @ApiProperty()
  journalEntry: {
    id: string;
    reference: string;
    description: string;
    entryDate: string;
    entryType?: string; // included if needed
    createdBy: {
      id: string;
      username: string;
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
  lines: Array<{
    accountId: string;
    account?: {
      // Optional: Include the full account object
      id: string;
      accountName: string;
      accountType: string;
    };
    debit: number;
    credit: number;
    lineType?: string;
  }>;
}

/**
 * For an aggregated approach.
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

/**
 * Detailed Response DTO.
 */
export class DayBookDetailedResponseDto {
  @ApiProperty({ description: 'Start date of the daybook query range' })
  startDate: string;

  @ApiProperty({ description: 'End date of the daybook query range' })
  endDate: string;

  @ApiProperty({
    type: [DayBookEntryDto],
    description: 'List of detailed day book entries',
  })
  data: DayBookEntryDto[];
}

/**
 * Aggregated Response DTO.
 */
export class DayBookAggregatedResponseDto {
  @ApiProperty({ description: 'Start date of the daybook query range' })
  startDate: string;

  @ApiProperty({ description: 'End date of the daybook query range' })
  endDate: string;

  @ApiProperty({
    type: [DayBookAggregatedDto],
    description: 'List of aggregated day book entries',
  })
  data: DayBookAggregatedDto[];
}
