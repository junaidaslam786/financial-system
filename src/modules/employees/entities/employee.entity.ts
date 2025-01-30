// entities/employee.entity.ts
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
  
  @Entity({ name: 'employees' })
  export class EmployeeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Company, (company) => company.id, {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'company_id' })
    company: Company;
  
    @Column({ name: 'employee_name', length: 255 })
    employeeName: string;
  
    @Column({ name: 'job_title', length: 255, nullable: true })
    jobTitle?: string;
  
    @Column({ name: 'department', length: 255, nullable: true })
    department?: string;
  
    @Column({ type: 'numeric', precision: 12, scale: 2, default: 0.0 })
    salary?: number;
  
    @Column({ name:'payment_schedule', length: 100, nullable: true })
    paymentSchedule?: string;
  
    @Column({ name: 'national_id', length: 100, nullable: true })
    nationalId?: string;
  
    @Column({ name: 'contact_info', type: 'text', nullable: true })
    contactInfo?: string;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;
  }
  