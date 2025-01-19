import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
  OneToMany,
} from 'typeorm';
import { Company } from '../../../companies/entities/company.entity';

import { ApiProperty } from '@nestjs/swagger';
import { SupplierEntity } from 'src/modules/company-contacts/suppliers/entities/supplier.entity';
import { BrokerEntity } from 'src/modules/company-contacts/brokers/entities/broker.entity';
import { PurchaseOrderLine } from './purchase-order-line.entity';

@Entity('purchase_orders')
@Check(`"status" IN ('Open','Received','Closed','Cancelled')`)
export class PurchaseOrder {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => SupplierEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'supplier_id' })
  supplier?: SupplierEntity;

  @ManyToOne(() => BrokerEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'broker_id' })
  broker?: BrokerEntity;

  @ApiProperty()
  @Column({ name: 'order_number', type: 'varchar', length: 100, unique: true })
  orderNumber: string;

  @ApiProperty()
  @Column({ name: 'order_date', type: 'date', default: () => 'CURRENT_DATE' })
  orderDate: Date;

  @ApiProperty({ required: false })
  @Column({ name: 'expected_delivery_date', type: 'date', nullable: true })
  expectedDeliveryDate?: Date;

  @ApiProperty()
  @Column({ length: 50, default: 'Open' })
  status: string;

  @ApiProperty({ example: 'false' })
  @Column({ type: 'boolean', default: true })
  autoInvoicing: boolean;

  @OneToMany(() => PurchaseOrderLine, (line) => line.purchaseOrder, {
    cascade: true,
  })
  lines: PurchaseOrderLine[];

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
