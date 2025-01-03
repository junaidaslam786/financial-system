import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { LotEntity } from './../../lots/entities/lot.entity';
  import { ProductEntity } from './../../products/entities/product.entity';
  
  @Entity({ name: 'lot_raw_materials' })
  export class LotRawMaterialEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    // Many raw materials -> One lot
    @ManyToOne(() => LotEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'lot_id' })
    lot: LotEntity;
  
    @Column({ name: 'lot_id', type: 'uuid' })
    lotId: string;
  
    // Many raw materials -> One product
    @ManyToOne(() => ProductEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: ProductEntity;
  
    @Column({ name: 'product_id', type: 'uuid' })
    productId: string;
  
    @Column({
      name: 'quantity',
      type: 'numeric',
      precision: 15,
      scale: 2,
    })
    quantity: number;
  }
  