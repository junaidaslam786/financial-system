import { Company } from 'src/modules/companies/entities/company.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity('currencies')
export class Currency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'currency_code', length: 10, unique: true })
  currencyCode: string;

  @Column({ name: 'currency_name', length: 100, nullable: true })
  currencyName?: string;

  @Column({ nullable: true, length: 10 })
  symbol?: string;

  @Column({ name: 'decimal_places', default: 2 })
  decimalPlaces: number;
}
