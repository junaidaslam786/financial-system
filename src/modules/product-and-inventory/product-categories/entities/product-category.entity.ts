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
  
  @Entity({ name: 'product_categories' })
  export class ProductCategoryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    // Many categories -> One company
    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: Company;
  
    @Column({ name: 'company_id', type: 'uuid' })
    companyId: string; // store the raw FK
  
    @Column({ name: 'category_name', length: 100 })
    categoryName: string;
  
    @Column({ name: 'parent_category_id', type: 'uuid', nullable: true })
    parentCategoryId: string | null;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;
  }
  