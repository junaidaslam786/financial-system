import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebitNotesService } from './debit-notes.service';
import { DebitNotesController } from './debit-notes.controller';

import { Company } from '../../companies/entities/company.entity';
import { DebitNote } from './entities/debit-notes.entity';
import { Invoice } from '../invoices/entities/invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DebitNote, Invoice, Company])],
  providers: [DebitNotesService],
  controllers: [DebitNotesController],
  exports: [DebitNotesService],
})
export class DebitNotesModule {}
