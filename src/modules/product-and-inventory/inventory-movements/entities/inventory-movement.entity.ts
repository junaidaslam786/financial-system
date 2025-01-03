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
  import { InventoryEntity } from './../../inventory/entities/inventory.entity';
  
  @Entity({ name: 'inventory_movements' })
  export class InventoryMovementEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    // Many movements -> One company
    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: Company;
  
    @Column({ name: 'company_id', type: 'uuid' })
    @Index('idx_inventory_movements_company_id')
    companyId: string;
  
    // Many movements -> One inventory record (nullable)
    @ManyToOne(() => InventoryEntity, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'inventory_id' })
    inventory?: InventoryEntity;
  
    @Column({ name: 'inventory_id', type: 'uuid', nullable: true })
    @Index('idx_inventory_movements_inventory_id')
    inventoryId?: string;
  
    // movement_type IN('IN','OUT','ADJUSTMENT')
    @Column({ name: 'movement_type', length: 50, nullable: true })
    movementType?: string;
  
    @Column({
      name: 'quantity',
      type: 'numeric',
      precision: 15,
      scale: 2,
      nullable: true,
    })
    quantity?: number;
  
    @Column({ type: 'text', nullable: true })
    reason?: string;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;
  }
  