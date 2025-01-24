import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SalesOrderEntity } from './sales-order.entity';
import { ProductEntity } from './../../../product-and-inventory/products/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';
import { LotEntity } from 'src/modules/product-and-inventory/lots/entities/lot.entity';

@Entity('sales_order_lines')
export class SalesOrderLine {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: () => SalesOrderEntity })
  @ManyToOne(() => SalesOrderEntity, (order) => order.lines, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sales_order_id' })
  salesOrder: SalesOrderEntity;

  @ManyToOne(() => LotEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'lot_id' })
  lot?: LotEntity;

  @Column({ name: 'lot_id', type: 'uuid', nullable: true })
  lotId?: string;

  @ApiProperty({ type: () => ProductEntity, nullable: true })
  @ManyToOne(() => ProductEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_id' })
  product?: ProductEntity;

  @ApiProperty({ example: 10.0 })
  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  quantity: number;

  @ApiProperty({ example: 100.0 })
  @Column({
    name: 'unit_price',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
  })
  unitPrice: number;

  @ApiProperty({ example: 10.0 })
  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  discount: number;

  @ApiProperty({ example: 5.0 })
  @Column({
    name: 'tax_rate',
    type: 'numeric',
    precision: 5,
    scale: 2,
    default: 0,
  })
  taxRate: number;

  @ApiProperty({ example: 100.0 })
  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    generatedType: 'STORED',
    asExpression: `(quantity * unit_price) - discount + ((quantity * unit_price - discount) * (tax_rate / 100))`,
  })
  totalLineAmount: number;
}
