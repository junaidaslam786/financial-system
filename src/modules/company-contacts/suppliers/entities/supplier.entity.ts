import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Unique,
  } from 'typeorm';
  import { Company } from 'src/modules/companies/entities/company.entity';
  import { PriceList } from 'src/modules/financial/price-lists/entities/price-list.entity';
  import { Account } from 'src/modules/financial/accounts/entities/account.entity';
  
  @Entity({ name: 'suppliers' })
  export class SupplierEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    // Many suppliers -> One company
    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: Company;
  
    @Column({ name: 'supplier_name', length: 255 })
    supplierName: string;
  
    @Column({ type: 'text', nullable: true })
    contactInfo?: string;
  
    @Column({ name: 'payment_terms', length: 100, nullable: true })
    paymentTerms?: string;
  
    // Many suppliers -> One PriceList (optional)
    @ManyToOne(() => PriceList, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'default_price_list_id' })
    defaultPriceList?: PriceList;
  
    // One-to-one relationship with Accounts
    // If you marked "account_id UNIQUE" in the migration, it ensures 1:1
    @ManyToOne(() => Account, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'account_id' })
    account?: Account;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;
  }
  