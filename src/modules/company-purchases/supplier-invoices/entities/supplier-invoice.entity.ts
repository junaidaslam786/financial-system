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
import { SupplierInvoiceItem } from './supplier-invoice-item.entity';
  
  @Entity('supplier_invoices')
  @Check(`"status" IN ('Unpaid','Paid','Partially Paid','Cancelled')`)
  export class SupplierInvoice {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Company, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'company_id' })
    company?: Company;
  
    @ManyToOne(() => SupplierEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'supplier_id' })
    supplier?: SupplierEntity;
  
    @ManyToOne(() => BrokerEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'broker_id' })
    broker?: BrokerEntity;
  
    @ApiProperty()
    @Column({ name: 'invoice_number', type: 'varchar', length: 100, unique: true })
    invoiceNumber: string;
  
    @ApiProperty()
    @Column({ name: 'invoice_date', type: 'date', default: () => 'CURRENT_DATE' })
    invoiceDate: Date;
  
    @ApiProperty({ required: false })
    @Column({ name: 'due_date', type: 'date', nullable: true })
    dueDate?: Date;
  
    @ApiProperty()
    @Column({ name: 'total_amount', type: 'numeric', precision: 15, scale: 2, default: 0 })
    totalAmount: number;
  
    @ApiProperty({ required: false })
    @Column({ type: 'varchar', length: 10, nullable: true })
    currency?: string;
  
    @ApiProperty()
    @Column({ length: 50, default: 'Unpaid' })
    status: string;
  
    @OneToMany(() => SupplierInvoiceItem, (item) => item.supplierInvoice, { cascade: true })
    items: SupplierInvoiceItem[];
  
    @ApiProperty()
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
  
    @ApiProperty()
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;
  }
  