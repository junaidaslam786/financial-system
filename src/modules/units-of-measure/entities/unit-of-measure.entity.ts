
import { Company } from 'src/modules/companies/entities/company.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    Unique,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  
  @Entity({ name: 'units_of_measure' })
  // @Unique('idx_units_of_measure_company_uom_name', ['companyId', 'uomName']) 
  export class UnitOfMeasureEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    // Possibly relate to a company if needed:
    @ManyToOne(() => Company, { nullable: true })
    @JoinColumn({ name: 'company_id' })
    company?: Company;
  
    @Column({ name: 'uom_name', length: 50 })
    uomName: string;
  
    @Column({ name: 'uom_description', type: 'text', nullable: true })
    uomDescription?: string;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;
  }
  