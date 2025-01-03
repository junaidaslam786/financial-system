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
  import { ProductionOrderEntity } from './../../production-orders/entities/production-order.entity';
  
  @Entity({ name: 'packaging_orders' })
  export class PackagingOrderEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    // Many packaging orders -> One company
    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: Company;
  
    @Column({ name: 'company_id', type: 'uuid' })
    @Index('idx_packaging_orders_company_id')
    companyId: string;
  
    // Many packaging orders -> One production order (optional)
    @ManyToOne(() => ProductionOrderEntity, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'production_order_id' })
    productionOrder?: ProductionOrderEntity;
  
    @Column({ name: 'production_order_id', type: 'uuid', nullable: true })
    @Index('idx_packaging_orders_production_order_id')
    productionOrderId?: string;
  
    @Column({ name: 'order_number', length: 100, unique: true, nullable: true })
    orderNumber?: string;
  
    @Column({
      name: 'total_quantity',
      type: 'numeric',
      precision: 15,
      scale: 2,
      nullable: true,
    })
    totalQuantity?: number;
  
    @Column({
      name: 'bag_weight',
      type: 'numeric',
      precision: 12,
      scale: 2,
      nullable: true,
    })
    bagWeight?: number;
  
    @Column({ name: 'number_of_bags', type: 'int', nullable: true })
    numberOfBags?: number;
  
    @Column({
      name: 'status',
      length: 50,
      default: 'Pending',
    })
    // possible values: 'Pending','In-Progress','Completed'
    status: string;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;
  }
  