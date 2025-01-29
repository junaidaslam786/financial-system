import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { JournalEntry } from '../journal/entities/journal-entry.entity';
import { JournalLine } from '../journal/entities/journal-line.entity';
import { DayBookQueryDto } from './dtos/day-book-query.dto';
import {
  DayBookResponseDto,
  DayBookEntryDto,
  DayBookAggregatedDto,
} from './dtos/day-book-response.dto';

@Injectable()
export class DayBookService {
  constructor(
    @InjectRepository(JournalEntry)
    private readonly journalEntryRepo: Repository<JournalEntry>,
    @InjectRepository(JournalLine)
    private readonly journalLineRepo: Repository<JournalLine>,
  ) {}

  /**
   * Retrieves a day book for the given date or date range.
   */
  async getDayBook(query: DayBookQueryDto): Promise<DayBookResponseDto> {
    // 1) Resolve date range
    const start = query.startDate || this.today();
    const end = query.endDate || start;

    const startDateValue = new Date(start);
    const endDateValue = new Date(end);

    const startDateTime = new Date(
      startDateValue.getFullYear(),
      startDateValue.getMonth(),
      startDateValue.getDate(),
      0,
      0,
      0,
      0,
    );

    const endDateTime = new Date(
      endDateValue.getFullYear(),
      endDateValue.getMonth(),
      endDateValue.getDate(),
      23,
      59,
      59,
      999,
    );

    const entries = await this.journalEntryRepo.find({
      where: {
        company: { id: query.companyId },
        entryDate: Between(startDateTime, endDateTime),
      },
      relations: ['lines', 'lines.account', 'createdBy', 'lines.journalEntry'],
      order: { entryDate: 'ASC' },
    });
    // 3) Decide if we want aggregated or detailed
    if (query.aggregated) {
      return this.buildAggregatedResponse(
        start.toString(),
        end.toString(),
        entries,
      );
    } else {
      return this.buildDetailedResponse(
        start.toString(),
        end.toString(),
        entries,
      );
    }
  }

  /**
   * Build a detailed daybook response, listing each journal entry & lines
   */
  private buildDetailedResponse(
    start: string,
    end: string,
    entries: JournalEntry[],
  ): DayBookResponseDto {
    const data: DayBookEntryDto[] = entries.map((entry) => ({
      journalEntry: {
        id: entry.id,
        reference: entry.reference,
        description: entry.description,
        entryDate: entry.entryDate.toISOString().split('T')[0],
        entryType: entry.entryType,
        createdBy: {
          id: entry.createdBy.id,
          username: entry.createdBy.username,
        },
        lines: entry.lines.map((l) => ({
          id: l.id,
          accountId: l.id,
          account: {
            id: l.account.id,
            accountName: l.account.accountName,
            accountType: l.account.accountType,
          },
          debit: Number(l.debit),
          credit: Number(l.credit),
        })),
      },
      reference: entry.reference,
      description: entry.description,
      entryDate: entry.entryDate.toISOString().split('T')[0],
      lines: entry.lines.map((l) => ({
        accountId: l.id,
        account: {
          id: l.account.id,
          accountName: l.account.accountName,
          accountType: l.account.accountType,
        },
        debit: Number(l.debit),
        credit: Number(l.credit),

        // Optional convenience: a "lineType" field:
        lineType: Number(l.debit) > 0 ? 'DEBIT' : 'CREDIT',
      })),
    }));

    return {
      startDate: start,
      endDate: end,
      data,
    };
  }

  /**
   * Summarize daybook by date + account, summing debits & credits
   */
  private buildAggregatedResponse(
    start: string,
    end: string,
    entries: JournalEntry[],
  ): DayBookResponseDto {
    // { date: { acctId: { debit: number, credit: number, account: AccountEntity } } }
    const aggregationMap: Record<
      string,
      Record<
        string,
        {
          debit: number;
          credit: number;
          account?: any; // or an Account type
        }
      >
    > = {};

    for (const entry of entries) {
      const dateStr = typeof entry.entryDate === 'string'
      ? entry.entryDate
      : (entry.entryDate as Date).toISOString().split('T')[0];
      if (!aggregationMap[dateStr]) {
        aggregationMap[dateStr] = {};
      }

      for (const line of entry.lines) {
        const acctId = line.account?.id ?? 'unknown';
        if (!aggregationMap[dateStr][acctId]) {
          aggregationMap[dateStr][acctId] = {
            debit: 0,
            credit: 0,
            account: line.account, 
          };
        }
        aggregationMap[dateStr][acctId].debit += Number(line.debit);
        aggregationMap[dateStr][acctId].credit += Number(line.credit);
      }
    }

    // Convert map -> array
    const data: DayBookAggregatedDto[] = [];
    for (const dateKey of Object.keys(aggregationMap)) {
      for (const acctKey of Object.keys(aggregationMap[dateKey])) {
        const { debit, credit, account } = aggregationMap[dateKey][acctKey];
        data.push({
          date: dateKey,
          accountId: acctKey,
          totalDebit: debit,
          totalCredit: credit,
          // Optionally embed the account object:
          account: {
            id: account?.id,
            accountName: account?.accountName,
            accountType: account?.accountType,
          },
        });
      }
    }

    return {
      startDate: start,
      endDate: end,
      data,
    };
  }

  private today(): string {
    const now = new Date();
    return now.toISOString().split('T')[0]; // e.g. '2025-01-07'
  }
}
