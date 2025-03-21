import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditNotesService } from './credit-notes.service';
import { CreditNotesController } from './credit-notes.controller';

import { Company } from '../../companies/entities/company.entity';
import { CreditNote } from './entities/credit-notes.entity';
import { Invoice } from '../invoices/entities/invoice.entity';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([CreditNote, Invoice, Company]), UsersModule],
  providers: [CreditNotesService],
  controllers: [CreditNotesController],
  exports: [CreditNotesService],
})
export class CreditNotesModule {}
