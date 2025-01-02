import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { BrokerEntity } from './../../brokers/entities/broker.entity';
  
  @Entity({ name: 'brokerage_agreements' })
  export class BrokerageAgreementEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => BrokerEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'broker_id' })
    broker: BrokerEntity;
  
    @Column({ name: 'agreement_name', length: 100, nullable: true })
    agreementName?: string;
  
    @Column({ name: 'brokerage_rate', type: 'numeric', precision: 5, scale: 2, nullable: true })
    brokerageRate?: number;
  
    @Column({ name: 'valid_from', type: 'date', nullable: true })
    validFrom?: Date;
  
    @Column({ name: 'valid_to', type: 'date', nullable: true })
    validTo?: Date;
  }
  