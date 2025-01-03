import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
  } from 'typeorm';
  import { Company } from 'src/modules/companies/entities/company.entity';
  import { WarehouseEntity } from './../../warehouses/entities/warehouse.entity';
  import { ProductEntity } from './../../products/entities/product.entity';
  
  @Entity({ name: 'inventory' })
  export class InventoryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    // Many inventory records -> One company
    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: Company;
  
    @Column({ name: 'company_id', type: 'uuid' })
    @Index('idx_inventory_company_id')
    companyId: string;
  
    // Many inventory records -> One warehouse (nullable)
    @ManyToOne(() => WarehouseEntity, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'warehouse_id' })
    warehouse?: WarehouseEntity;
  
    @Column({ name: 'warehouse_id', type: 'uuid', nullable: true })
    @Index('idx_inventory_warehouse_id')
    warehouseId?: string;
  
    // Many inventory records -> One product (nullable)
    @ManyToOne(() => ProductEntity, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'product_id' })
    product?: ProductEntity;
  
    @Column({ name: 'product_id', type: 'uuid', nullable: true })
    @Index('idx_inventory_product_id')
    productId?: string;
  
    @Column({
      name: 'quantity',
      type: 'numeric',
      precision: 15,
      scale: 2,
      default: 0.0,
    })
    quantity: number;
  
    @Column({ name: 'batch_number', length: 100, nullable: true })
    batchNumber?: string;
  
    @Column({ name: 'expiration_date', type: 'date', nullable: true })
    expirationDate?: string | Date;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;
  }
  