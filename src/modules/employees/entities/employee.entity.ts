// entities/employee.entity.ts
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
  
  @Entity({ name: 'employees' })
  export class EmployeeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => CompanyEntity, (company) => company.id, {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    })
    @Index('idx_employees_company_id')
    company: CompanyEntity;
  
    @Column({ length: 255 })
    employeeName: string;
  
    @Column({ length: 255, nullable: true })
    jobTitle?: string;
  
    @Column({ length: 255, nullable: true })
    department?: string;
  
    @Column({ type: 'numeric', precision: 12, scale: 2, default: 0.0 })
    salary?: number;
  
    @Column({ length: 100, nullable: true })
    paymentSchedule?: string;
  
    @Column({ length: 100, nullable: true })
    nationalId?: string;
  
    @Column({ type: 'text', nullable: true })
    contactInfo?: string;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;
  }
  