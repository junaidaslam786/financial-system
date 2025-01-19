import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
  } from 'typeorm';
  import { JournalEntry } from './journal-entry.entity';
  import { Account } from './../../accounts/entities/account.entity';
  
  @Entity('journal_lines')
  export class JournalLine {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => JournalEntry, (entry) => entry.lines, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'journal_entry_id' })
    journalEntry: JournalEntry;
  
    @ManyToOne(() => Account, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'account_id' })
    account: Account;
  
    @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
    debit: number;
  
    @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
    credit: number;
  
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
  }
  