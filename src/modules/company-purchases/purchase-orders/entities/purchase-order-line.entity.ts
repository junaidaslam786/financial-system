import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { PurchaseOrder } from './purchase-order.entity';
  import { ApiProperty } from '@nestjs/swagger';
import { ProductEntity } from 'src/modules/product-and-inventory/products/entities/product.entity';
import { Exclude } from 'class-transformer';
  
  @Entity('purchase_order_lines')
  export class PurchaseOrderLine {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Exclude()
    @ManyToOne(() => PurchaseOrder, (po) => po.lines, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'purchase_order_id' })
    purchaseOrder: PurchaseOrder;
  
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
    totalLineAmount: number;
  }
  