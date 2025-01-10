import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactLedgerEntry } from './entities/contact-ledger-entry.entity';
import { ContactLedgerService } from './contact-ledger.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContactLedgerEntry])],
  providers: [ContactLedgerService],
  exports: [ContactLedgerService], // so other modules can use it
})
export class ContactLedgerModule {}
