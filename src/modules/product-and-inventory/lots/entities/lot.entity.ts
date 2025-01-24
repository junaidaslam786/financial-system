import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Company } from 'src/modules/companies/entities/company.entity';
import { SupplierEntity } from './../../../company-contacts/suppliers/entities/supplier.entity';
import { ProductionOrderEntity } from '../../production-orders/entities/production-order.entity';
import { InvoiceItem } from 'src/modules/sales-and-invoicing/invoices/entities/invoice-item.entity';
import { SalesOrderLine } from 'src/modules/sales-and-invoicing/sales-orders/entities/sales-order-line.entity';
import { PurchaseOrderLine } from 'src/modules/company-purchases/purchase-orders/entities/purchase-order-line.entity';

@Entity({ name: 'lots' })
export class LotEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Many lots -> One company
  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'company_id', type: 'uuid' })
  @Index('idx_lots_company_id')
  companyId: string;

  @Column({ name: 'lot_number', length: 100, unique: true })
  lotNumber: string;

  // Optional relation to a supplier (raw paddy source)
  @ManyToOne(() => SupplierEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'source_supplier_id' })
  sourceSupplier?: SupplierEntity;

  @Column({ name: 'source_supplier_id', type: 'uuid', nullable: true })
  @Index('idx_lots_source_supplier_id')
  sourceSupplierId?: string;

  @Column({
    name: 'initial_quantity',
    type: 'numeric',
    precision: 15,
    scale: 2,
  })
  initialQuantity: number;

  @Column({
    name: 'current_quantity',
    type: 'numeric',
    precision: 15,
    scale: 2,
  })
  currentQuantity: number;

  @Column({
    name: 'status',
    length: 50,
    default: 'Pending',
  })
  // possible values: 'Pending', 'In-Process', 'Completed'
  status: string;

  @OneToMany(() => PurchaseOrderLine, (poLine) => poLine.lot)
  purchaseOrderLines: PurchaseOrderLine[];

  // 2) Sales lines
  @OneToMany(() => SalesOrderLine, (soLine) => soLine.lot)
  salesOrderLines: SalesOrderLine[];

  // 3) Invoice items
  @OneToMany(() => InvoiceItem, (invItem) => invItem.lot)
  invoiceItems: InvoiceItem[];

  // 4) Production orders (if your schema is one-lot-per-production-order)
  @OneToMany(() => ProductionOrderEntity, (prod) => prod.lot)
  productionOrders: ProductionOrderEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
