import { CompanyOwnerEntity } from 'src/modules/company-owners/entities/company-owner.entity';
import { EmployeeEntity } from 'src/modules/employees/entities/employee.entity';
import { PartnerEntity } from 'src/modules/partners/entities/partner.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'companies' })
@Index('idx_companies_name', ['name'])
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ name: 'registration_number', length: 100, nullable: true })
  registrationNumber?: string;

  @Column({ name: 'legal_structure', length: 100, nullable: true })
  legalStructure?: string;

  @Column({ nullable: true, type: 'text' })
  address?: string;

  @Column({ name: 'contact_info', type: 'text', nullable: true })
  contactInfo?: string;

  @Column({ name: 'default_currency', length: 10, default: 'USD' })
  defaultCurrency?: string;

  /**
   * The user who created this company
   * (not a foreign key in the migration, but you can set it up as a relation if you want)
   */
  @Column({ name: 'created_by_user_id', type: 'uuid', nullable: true })
  createdByUserId?: string;

  @OneToMany(() => CompanyOwnerEntity, (owner) => owner.company, {
    cascade: true,
  })
  companyOwners: CompanyOwnerEntity[];

  @OneToMany(() => EmployeeEntity, (emp) => emp.company)
  employees: EmployeeEntity[];

  @OneToMany(() => PartnerEntity, (partner) => partner.company)
  partners: PartnerEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
