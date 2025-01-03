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
  import { ProductionOrderEntity } from './../../production-orders/entities/production-order.entity';
  import { ProcessingStageEntity } from './../../processing-stages/entities/processing-stage.entity';
  
  @Entity({ name: 'production_order_stages' })
  export class ProductionOrderStageEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    // Many records -> One production order
    @ManyToOne(() => ProductionOrderEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'production_order_id' })
    productionOrder: ProductionOrderEntity;
  
    @Column({ name: 'production_order_id', type: 'uuid' })
    @Index('idx_production_order_stages_prod_order_id')
    productionOrderId: string;
  
    // Many records -> One processing stage
    @ManyToOne(() => ProcessingStageEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'processing_stage_id' })
    processingStage: ProcessingStageEntity;
  
    @Column({ name: 'processing_stage_id', type: 'uuid' })
    @Index('idx_production_order_stages_stage_id')
    processingStageId: string;
  
    @Column({ name: 'start_time', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    startTime: Date;
  
    @Column({ name: 'end_time', type: 'timestamptz', nullable: true })
    endTime?: Date;
  
    @Column({ name: 'input_quantity', type: 'numeric', precision: 15, scale: 2, nullable: true })
    inputQuantity?: number;
  
    @Column({ name: 'output_quantity', type: 'numeric', precision: 15, scale: 2, nullable: true })
    outputQuantity?: number;
  
    @Column({ type: 'text', nullable: true })
    notes?: string;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;
  }
  