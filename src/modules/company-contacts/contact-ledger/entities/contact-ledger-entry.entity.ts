import { ContactType } from 'src/common/enums/contact-type.enum';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
  } from 'typeorm';
  
  @Entity('contact_ledger_entries')
  @Index('idx_contact_ledger_entries_company_contact', [
    'companyId',
    'contactType',
    'contactId',
  ])
  @Index('idx_contact_ledger_entries_ref', ['referenceType', 'referenceId'])
  export class ContactLedgerEntry {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ name: 'company_id' })
    companyId: string;
  
    @Column({
      name: 'contact_type',
      length: 50,
    })
    contactType: ContactType;
  
    @Column({ name: 'contact_id' })
    contactId: string; // references e.g. suppliers.id or customers.id
  
    @Column({ name: 'reference_type', nullable: true })
    referenceType?: string; // 'INVOICE', 'PAYMENT', etc.
  
    @Column({ name: 'reference_id', nullable: true })
    referenceId?: string; // e.g. invoiceId or paymentId
  
    @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
    debit: number;
  
    @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
    credit: number;
  
    @Column({
      name: 'entry_date',
      type: 'timestamptz',
      default: () => 'CURRENT_TIMESTAMP',
    })
    entryDate: Date;
  
    @Column({ type: 'text', nullable: true })
    description?: string;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }
  