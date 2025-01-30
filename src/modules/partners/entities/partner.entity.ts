// entities/partner.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    JoinColumn,
  } from 'typeorm';
  import { Company } from '../../companies/entities/company.entity';
  
  @Entity({ name: 'partners' })
  export class PartnerEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Company, (company) => company.id, {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'company_id' })
    @Index('idx_partners_company_id')
    company: Company;
  
    @Column({ length: 255 })
    partnerName: string;
  
    @Column({ type: 'numeric', precision: 15, scale: 2, nullable: true })
    investmentAmount?: number;
  
    @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
    shares?: number;
  
    @Column({ name: 'partner_type', length: 50, nullable: true })
    partnerType?: string;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;
  }
  