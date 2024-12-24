import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
  } from 'typeorm';
  // If you want a relationship to CompanyEntity:
  import { CompanyEntity } from '../../companies/entities/company.entity';
  
  @Entity({ name: 'company_owners' })
  export class CompanyOwnerEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => CompanyEntity, (company) => company.id, {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    })
    @Index('idx_company_owners_company_id')
    company: CompanyEntity;
  
    @Column({ length: 255 })
    ownerName: string;
  
    @Column({ type: 'text', nullable: true })
    contactInfo?: string;
  
    @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
    ownershipPercentage?: number;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;
  }
  