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
  
    @Column({ name: 'payment_method', type: 'varchar', length: 100, nullable: true })
    paymentMethod?: string;
  
    @Column({ type: 'text', nullable: true })
    reference?: string;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;
  }
  