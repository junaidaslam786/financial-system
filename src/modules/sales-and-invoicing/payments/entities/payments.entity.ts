import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Invoice } from '../../invoices/entities/invoice.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import { JournalEntry } from 'src/modules/financial/journal/entities/journal-entry.entity';
import { PaymentMethod } from '../../payment-methods/entities/payment-methods.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Company, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => Invoice, { onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  @JoinColumn({ name: 'invoice_id' })
  invoice?: Invoice;

  @Column({ name: 'payment_date', type: 'date', default: () => 'CURRENT_DATE' })
  paymentDate: Date;

  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
  amount: number;

  @ManyToOne(() => PaymentMethod, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod?: PaymentMethod;

  @ManyToOne(() => JournalEntry, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'journal_entry_id' })
  journalEntry?: JournalEntry;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
