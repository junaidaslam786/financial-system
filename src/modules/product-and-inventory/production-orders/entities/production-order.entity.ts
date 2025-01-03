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
  import { LotEntity } from './../../lots/entities/lot.entity';
  
  @Entity({ name: 'production_orders' })
  export class ProductionOrderEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    // Many orders -> One company
    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: Company;
  
    @Column({ name: 'company_id', type: 'uuid' })
    @Index('idx_production_orders_company_id')
    companyId: string;
  
    // Many production orders -> One lot
    @ManyToOne(() => LotEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'lot_id' })
    lot: LotEntity;
  
    @Column({ name: 'lot_id', type: 'uuid' })
    @Index('idx_production_orders_lot_id')
    lotId: string;
  
    @Column({ name: 'order_number', length: 100, unique: true })
    orderNumber: string;
  
    @Column({ name: 'start_date', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    startDate: Date;
  
    @Column({ name: 'end_date', type: 'timestamptz', nullable: true })
    endDate?: Date;
  
    @Column({
      name: 'status',
      length: 50,
      default: 'Open',
    })
    // possible values: 'Open','In-Progress','Completed','Closed'
    status: string;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;
  }
  