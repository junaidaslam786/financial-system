import { Company } from 'src/modules/companies/entities/company.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
  } from 'typeorm';
  
  @Entity('payment_methods')
  export class PaymentMethod {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Company, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: Company;
  
    @Column({ name: 'method_name', type: 'varchar', length: 100 })
    methodName: string;
  
    @Column({ type: 'text', nullable: true })
    details?: string;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
  }
  