import { Company } from 'src/modules/companies/entities/company.entity';
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
 
  
  @Entity('credit_notes')
  export class CreditNote {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Company, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: Company;
  
    @ManyToOne(() => Invoice, { onUpdate: 'CASCADE', onDelete: 'SET NULL' })
    @JoinColumn({ name: 'invoice_id' })
    invoice?: Invoice;
  
    @Column({ name: 'note_number', type: 'varchar', length: 100, unique: true })
    noteNumber: string;
  
    @Column({ name: 'note_date', type: 'date', default: () => 'CURRENT_DATE' })
    noteDate: Date;
  
    @Column({ type: 'numeric', precision: 15, scale: 2, nullable: false })
    amount: number;
  
    @Column({ type: 'text', nullable: true })
    reason?: string;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;
  }
  