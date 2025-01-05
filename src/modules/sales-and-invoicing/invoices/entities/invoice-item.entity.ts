import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Invoice } from './invoice.entity';
import { ProductEntity } from 'src/modules/product-and-inventory/products/entities/product.entity';
 
  
  @Entity('invoice_items')
  export class InvoiceItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Invoice, (invoice) => invoice.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'invoice_id' })
    invoice: Invoice;
  
    @ManyToOne(() => ProductEntity, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'product_id' })
    product: ProductEntity;
  
    @Column({ type: 'text', nullable: true })
    description?: string;
  
    @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
    quantity: number;
  
    @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
    unitPrice: number;
  
    @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
    discount: number;
  
    @Column({ type: 'numeric', precision: 5, scale: 2, default: 0 })
    taxRate: number;
  
    @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
    totalPrice: number;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;
  }
  