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
  // If you want a relationship to Company:
  import { Company } from '../../companies/entities/company.entity';
  
  @Entity({ name: 'company_owners' })
  export class CompanyOwnerEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Company, (company) => company.id, {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'company_id' })
    @Index('idx_company_owners_company_id')
    company: Company;
  
    @Column({ name: 'owner_name', length: 255 })
    ownerName: string;
  
    @Column({ type: 'text', nullable: true, name: 'contact_info' })
    contactInfo?: string;
  
    @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true, name: 'ownership_percentage' })
    ownershipPercentage?: number;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;
  }
  