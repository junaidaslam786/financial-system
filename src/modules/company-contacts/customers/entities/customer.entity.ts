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
  import { PriceList } from 'src/modules/financial/price-lists/entities/price-list.entity';
  import { Account } from 'src/modules/financial/accounts/entities/account.entity';
  
  @Entity({ name: 'customers' })
  export class CustomerEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: Company;
  
    @Column({ name: 'customer_name', length: 255 })
    customerName: string;
  
    @Column({ type: 'text', nullable: true })
    contactInfo?: string;
  
    @Column({ name: 'customer_type', length: 100, nullable: true })
    customerType?: string;
  
    @Column({ name: 'credit_limit', type: 'numeric', precision: 12, scale: 2, nullable: true })
    creditLimit?: number;
  
    @Column({ name: 'payment_terms', length: 100, nullable: true })
    paymentTerms?: string;
  
    @ManyToOne(() => PriceList, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'default_price_list_id' })
    defaultPriceList?: PriceList;
  
    // One-to-one with accounts
    @ManyToOne(() => Account, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'account_id' })
    account?: Account;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;
  }
  