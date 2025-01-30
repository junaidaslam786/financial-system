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

@Entity({ name: 'processing_stages' })
export class ProcessingStageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Many processing stages -> One company
  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'company_id', type: 'uuid' })
  @Index('idx_processing_stages_company_id')
  companyId: string;

  @Column({ name: 'stage_name', length: 100 })
  stageName: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
