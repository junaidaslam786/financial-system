import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DayBookService } from './day-book.service';
import { DayBookController } from './day-book.controller';
// We need access to the JournalEntry and JournalLine
import { JournalEntry } from '../journal/entities/journal-entry.entity';
import { JournalLine } from '../journal/entities/journal-line.entity';
// Possibly also need Company, Account if needed
import { Company } from '../../companies/entities/company.entity';
import { Account } from '../accounts/entities/account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JournalEntry,
      JournalLine,
      Company,
      Account,
    ]),
  ],
  controllers: [DayBookController],
  providers: [DayBookService],
  exports: [DayBookService],
})
export class DayBookModule {}
