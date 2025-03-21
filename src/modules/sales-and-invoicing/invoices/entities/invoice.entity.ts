import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

import { InvoiceItem } from './invoice-item.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import { CustomerEntity } from 'src/modules/company-contacts/customers/entities/customer.entity';
import { BrokerEntity } from 'src/modules/company-contacts/brokers/entities/broker.entity';
import { SalesOrderEntity } from '../../sales-orders/entities/sales-order.entity';
import { JournalEntry } from 'src/modules/financial/journal/entities/journal-entry.entity';
import { SupplierEntity } from 'src/modules/company-contacts/suppliers/entities/supplier.entity';
import { PurchaseOrder } from 'src/modules/company-purchases/purchase-orders/entities/purchase-order.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'invoice_type', type: 'varchar', length: 20 })
  invoiceType: 'Purchase' | 'Sale';

  // For a Purchase
  @ManyToOne(() => SupplierEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'supplier_id' })
  supplier?: SupplierEntity;

  @ManyToOne(() => CustomerEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity;

  @ManyToOne(() => BrokerEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'broker_id' })
  broker?: BrokerEntity;

  @Column({ name: 'invoice_number', length: 100, unique: true })
  invoiceNumber: string;

  @Column({ name: 'invoice_date', type: 'date', default: () => 'CURRENT_DATE' })
  invoiceDate: Date;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate?: Date;
  
  @Column({ length: 10, nullable: true })
  currency?: string;

  @Column({
    name: 'total_amount',
    type: 'numeric',
    precision: 15,
    scale: 2,
    default: 0,
  })
  totalAmount: number;

  @ManyToOne(() => SalesOrderEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'sales_order_id' })
  salesOrder?: SalesOrderEntity;

  @ManyToOne(() => PurchaseOrder, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'purchase_order_id' })
  purchaseOrder?: PurchaseOrder;

  // Linking to journal entries
  @ManyToOne(() => JournalEntry, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'journal_entry_id' })
  journalEntry?: JournalEntry;


  @Column({
    type: 'varchar',
    length: 50,
    default: 'Unpaid',
    enum: ['Unpaid', 'Paid', 'Partially Paid', 'Cancelled'],
  })
  status: string;

  @Column({ name: 'terms_and_conditions', type: 'text', nullable: true })
  termsAndConditions?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @OneToMany(() => InvoiceItem, (item) => item.invoice, { cascade: true })
  items: InvoiceItem[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
