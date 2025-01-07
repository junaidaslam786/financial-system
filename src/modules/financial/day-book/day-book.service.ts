import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { JournalEntry } from '../journal/entities/journal-entry.entity';
import { JournalLine } from '../journal/entities/journal-line.entity';
import { DayBookQueryDto } from './dtos/day-book-query.dto';
import { DayBookResponseDto, DayBookEntryDto, DayBookAggregatedDto } from './dtos/day-book-response.dto';

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
    const start = query.startDate ? query.startDate : this.today();
    const end = query.endDate ? query.endDate : start;

    const startDateTime = new Date(`${start}T00:00:00`);
    const endDateTime = new Date(`${end}T23:59:59.999`);

    // 2) Query journal entries for the date range & company
    const entries = await this.journalEntryRepo.find({
      where: {
        company: { id: query.companyId },
        entryDate: Between(startDateTime, endDateTime),
      },
      relations: ['lines'], // we want to load lines
      order: { entryDate: 'ASC' },
    });

    // 3) Decide if we want aggregated or detailed
    if (query.aggregated) {
      return this.buildAggregatedResponse(start, end, entries);
    } else {
      return this.buildDetailedResponse(start, end, entries);
    }
  }

  /**
   * Build a detailed daybook response, listing each journal entry & lines
   */
  private buildDetailedResponse(start: string, end: string, entries: JournalEntry[]): DayBookResponseDto {
    const data: DayBookEntryDto[] = entries.map((entry) => ({
      journalEntryId: entry.id,
      reference: entry.reference,
      description: entry.description,
      entryDate: entry.entryDate.toISOString().split('T')[0],
      lines: entry.lines.map((l) => ({
        accountId: l.account.id, // might need to load account relation if not done
        debit: Number(l.debit),
        credit: Number(l.credit),
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
  private buildAggregatedResponse(start: string, end: string, entries: JournalEntry[]): DayBookResponseDto {
    // We’ll create a map: { date -> {accountId -> { totalDebit, totalCredit }} }
    const aggregationMap: Record<string, Record<string, { debit: number; credit: number }>> = {};

    for (const entry of entries) {
      const dateStr = entry.entryDate.toISOString().split('T')[0];
      if (!aggregationMap[dateStr]) {
        aggregationMap[dateStr] = {};
      }

      for (const line of entry.lines) {
        // If you haven't loaded line.account, you might need to do so or store accountId in line
        const acctId = line.account?.id ?? 'unknown';
        if (!aggregationMap[dateStr][acctId]) {
          aggregationMap[dateStr][acctId] = { debit: 0, credit: 0 };
        }
        aggregationMap[dateStr][acctId].debit += Number(line.debit);
        aggregationMap[dateStr][acctId].credit += Number(line.credit);
      }
    }

    // Convert map -> array
    const data: DayBookAggregatedDto[] = [];
    for (const dateKey of Object.keys(aggregationMap)) {
      for (const acctKey of Object.keys(aggregationMap[dateKey])) {
        data.push({
          date: dateKey,
          accountId: acctKey,
          totalDebit: aggregationMap[dateKey][acctKey].debit,
          totalCredit: aggregationMap[dateKey][acctKey].credit,
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
