// src/modules/reports/reports.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';

// Entities we might need
import { JournalEntry } from 'src/modules/financial/journal/entities/journal-entry.entity';
import { JournalLine } from 'src/modules/financial/journal/entities/journal-line.entity';
import { Account } from 'src/modules/financial/accounts/entities/account.entity';
import { ContactLedgerEntry } from 'src/modules/company-contacts/contact-ledger/entities/contact-ledger-entry.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JournalEntry,
      JournalLine,
      Account,
      ContactLedgerEntry,
    ]),
    UsersModule

  ],
  providers: [ReportsService],
  controllers: [ReportsController],
  exports: [ReportsService],
})
export class ReportsModule {}
