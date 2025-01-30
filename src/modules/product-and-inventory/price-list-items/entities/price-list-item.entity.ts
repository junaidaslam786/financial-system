import { PriceList } from 'src/modules/financial/price-lists/entities/price-list.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductEntity } from '../../products/entities/product.entity';

@Entity({ name: 'price_list_items' })
export class PriceListItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Many items -> One price list
  @ManyToOne(() => PriceList, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'price_list_id' })
  priceList: PriceList;

  @Column({ name: 'price_list_id', type: 'uuid' })
  priceListId: string;

  // Many items -> One product
  @ManyToOne(() => ProductEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  price?: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
