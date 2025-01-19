import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
} from 'typeorm';
import { Company } from 'src/modules/companies/entities/company.entity';
import { CustomerEntity } from './../../../company-contacts/customers/entities/customer.entity';
import { TraderEntity } from './../../../company-contacts/traders/entities/trader.entity';
import { BrokerEntity } from './../../../company-contacts/brokers/entities/broker.entity';
import { SalesOrderLine } from './sales-order-line.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('sales_orders')
@Check(`status IN ('Pending','Confirmed','Shipped','Completed','Cancelled')`)
export class SalesOrderEntity {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: () => Company })
  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ApiProperty({ type: () => CustomerEntity, nullable: true })
  @ManyToOne(() => CustomerEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'customer_id' })
  customer?: CustomerEntity;

  @ApiProperty({ type: () => TraderEntity, nullable: true })
  @ManyToOne(() => TraderEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'trader_id' })
  trader?: TraderEntity;

  @ApiProperty({ example: 'SO-0001' })
  @Column({ name: 'order_number', length: 100, unique: true })
  orderNumber: string;

  @ApiProperty({ example: '2021-08-01' })
  @Column({ name: 'order_date', type: 'date', default: () => 'CURRENT_DATE' })
  orderDate: Date;

  @ApiProperty({ example: 'Pending' })
  @Column({ length: 50, default: 'Pending' })
  status: string;

  @ApiProperty({ example: 'false' })
  @Column({ type: 'boolean', default: true })
  autoInvoicing: boolean;

  @ApiProperty({ example: 1000.0 })
  @Column({ name: 'total_amount', type: 'numeric', precision: 15, scale: 2 })
  totalAmount: number;

  @ApiProperty({ type: () => BrokerEntity, nullable: true })
  @ManyToOne(() => BrokerEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'brokerage_id' })
  brokerage?: BrokerEntity;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @OneToMany(() => SalesOrderLine, (line) => line.salesOrder, { cascade: true })
  lines: SalesOrderLine[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
