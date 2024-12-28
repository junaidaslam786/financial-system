import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Company } from './../../../companies/entities/company.entity'; 
    // Adjust path to wherever Company entity is defined
  
  @Entity('accounts')
  export class Account {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: Company;  // Each account belongs to a company
  
    @Column({ name: 'account_name', length: 255 })
    accountName: string;
  
    @Column({ name: 'account_type', length: 100 })
    accountType: string; // e.g. 'ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'
  
    @Column({ name: 'parent_account_id', nullable: true })
    parentAccountId?: string;
  
    @Column({ nullable: true, length: 10 })
    currency?: string;
  
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
  }
  