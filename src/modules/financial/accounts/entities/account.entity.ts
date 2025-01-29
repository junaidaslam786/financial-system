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
import { BalanceType } from 'src/common/enums/balace-type';
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
  
    @Column({ nullable: true, length: 10, name: 'currency' })
    currency?: string;

    @Column({
      name: 'initial_balance',
      type: 'numeric',
      precision: 15,
      scale: 2,
      default: 0,
    })
    initialBalance: number;
  
    @Column({
      name: 'initial_balance_type',
      type: 'varchar',
      length: 10,
      nullable: true,
    })
    initialBalanceType?: BalanceType;
  
    @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
    updatedAt: Date;
  }
  