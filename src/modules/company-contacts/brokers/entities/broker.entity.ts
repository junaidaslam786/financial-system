import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Company } from 'src/modules/companies/entities/company.entity';
  import { Account } from 'src/modules/financial/accounts/entities/account.entity';
  
  @Entity({ name: 'brokers' })
  export class BrokerEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: Company;
  
    @Column({ name: 'broker_name', length: 255 })
    brokerName: string;
  
    @Column({ type: 'text', nullable: true })
    contactInfo?: string;
  
    @Column({ name: 'default_brokerage_rate', type: 'numeric', precision: 5, scale: 2, default: 0.0 })
    defaultBrokerageRate: number;
  
    // One-to-one with accounts
    @ManyToOne(() => Account, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'account_id' })
    account?: Account;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;
  }
  