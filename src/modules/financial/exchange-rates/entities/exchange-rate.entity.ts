import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('exchange_rates')
export class ExchangeRate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'base_currency', length: 10 })
  baseCurrency: string;

  @Column({ name: 'target_currency', length: 10 })
  targetCurrency: string;

  @Column({ type: 'numeric', precision: 18, scale: 6 })
  rate: number;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  effectiveDate: Date;
}
