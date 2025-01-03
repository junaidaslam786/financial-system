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
  
  @Entity({ name: 'warehouses' })
  export class WarehouseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    // Many warehouses -> One company
    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: Company;
  
    @Column({ name: 'company_id', type: 'uuid' })
    @Index('idx_warehouses_company_id')
    companyId: string;
  
    @Column({ type: 'varchar', length: 255, nullable: true })
    location?: string;
  
    @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
    capacity?: number;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;
  }
  