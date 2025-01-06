import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { SupplierInvoice } from './supplier-invoice.entity';
  import { ProductEntity } from '../../../product-and-inventory/products/entities/product.entity';
  import { ApiProperty } from '@nestjs/swagger';
  
  @Entity('supplier_invoice_items')
  export class SupplierInvoiceItem {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => SupplierInvoice, (inv) => inv.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'supplier_invoice_id' })
    supplierInvoice: SupplierInvoice;
  
    @ManyToOne(() => ProductEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'product_id' })
    product?: ProductEntity;
  
    @ApiProperty()
    @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
    quantity: number;
  
    @ApiProperty()
    @Column({ name: 'unit_price', type: 'numeric', precision: 12, scale: 2, default: 0 })
    unitPrice: number;
  
    @ApiProperty()
    @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
    discount: number;
  
    @ApiProperty()
    @Column({ name: 'tax_rate', type: 'numeric', precision: 5, scale: 2, default: 0 })
    taxRate: number;
  
    @ApiProperty()
    @Column({
      type: 'numeric',
      precision: 12,
      scale: 2,
      generatedType: 'STORED',
      asExpression: `
        ((quantity * unit_price) - discount)
         + (
           ((quantity * unit_price) - discount)
           * (tax_rate / 100)
         )
      `,
    })
    totalPrice: number;
  }
  