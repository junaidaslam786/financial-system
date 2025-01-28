import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactLedgerEntry } from './entities/contact-ledger-entry.entity';
import { ContactLedgerService } from './contact-ledger.service';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ContactLedgerEntry]), UsersModule],
  providers: [ContactLedgerService],
  exports: [ContactLedgerService], // so other modules can use it
})
export class ContactLedgerModule {}
