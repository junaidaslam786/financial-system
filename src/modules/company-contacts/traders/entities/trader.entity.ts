import { Company } from 'src/modules/companies/entities/company.entity';
import { Account } from 'src/modules/financial/accounts/entities/account.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'traders' })
export class TraderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'trader_name', length: 255 })
  traderName: string;

  @Column({ type: 'text', nullable: true })
  contactInfo?: string;

  @Column({
    name: 'commission_rate',
    type: 'numeric',
    precision: 5,
    scale: 2,
    default: 0.0,
  })
  commissionRate: number;

  @ManyToOne(() => Account, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'account_id' })
  account?: Account;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
