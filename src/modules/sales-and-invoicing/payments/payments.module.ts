import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment } from './entities/payments.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import { Invoice } from '../invoices/entities/invoice.entity';
import { InvoicesModule } from '../invoices/invoices.module';
import { CompaniesModule } from 'src/modules/companies/companies.module';
import { JournalModule } from 'src/modules/financial/journal/journal.module';
import { ContactLedgerModule } from 'src/modules/company-contacts/contact-ledger/contact-ledger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Company, Invoice]),
    CompaniesModule,
    InvoicesModule,
    JournalModule,
    ContactLedgerModule
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule {}
