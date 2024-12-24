// entities/partner.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
  } from 'typeorm';
  import { CompanyEntity } from '../../companies/entities/company.entity';
  
  @Entity({ name: 'partners' })
  export class PartnerEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => CompanyEntity, (company) => company.id, {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    })
    @Index('idx_partners_company_id')
    company: CompanyEntity;
  
    @Column({ length: 255 })
    partnerName: string;
  
    @Column({ type: 'numeric', precision: 15, scale: 2, nullable: true })
    investmentAmount?: number;
  
    @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
    shares?: number;
  
    @Column({ length: 50, nullable: true })
    partnerType?: string;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;
  }
  