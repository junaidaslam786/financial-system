import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { BrokerEntity } from './../../brokers/entities/broker.entity';
  
  @Entity({ name: 'brokerage_transactions' })
  export class BrokerageTransactionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => BrokerEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'broker_id' })
    broker: BrokerEntity;
  
    @Column({ name: 'related_document_id', type: 'uuid', nullable: true })
    relatedDocumentId?: string;
  
    @Column({ name: 'document_type', length: 50, nullable: true })
    documentType?: string; // 'Invoice','PurchaseOrder','SalesOrder'
  
    @Column({ name: 'brokerage_amount', type: 'numeric', precision: 15, scale: 2, nullable: true })
    brokerageAmount?: number;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;
  }
  