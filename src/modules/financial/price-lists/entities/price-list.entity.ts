import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Company } from 'src/modules/companies/entities/company.entity';
  
  @Entity('price_lists')
  export class PriceList {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: Company;
  
    @Column({ name: 'list_name', length: 100 })
    listName: string;
  
    @Column({ length: 10, nullable: true })
    currency?: string;
  
    @Column({name: 'is_default', default: false })
    isDefault: boolean;
  
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
  }
  