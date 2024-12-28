import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('currencies')
export class Currency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'currency_code', length: 10, unique: true })
  currencyCode: string;

  @Column({ name: 'currency_name', length: 100, nullable: true })
  currencyName?: string;

  @Column({ nullable: true, length: 10 })
  symbol?: string;

  @Column({ default: 2 })
  decimalPlaces: number;
}
