import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    OneToMany,
  } from 'typeorm';
  import { Company } from 'src/modules/companies/entities/company.entity';
  import { ProductCategoryEntity } from './../../product-categories/entities/product-category.entity';
  import { UnitOfMeasureEntity } from './../../../units-of-measure/entities/unit-of-measure.entity';
import { LotEntity } from '../../lots/entities/lot.entity';
  
  @Entity({ name: 'products' })
  export class ProductEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    // Many products -> One company
    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: Company;
  
    @Column({ name: 'company_id', type: 'uuid' })
    @Index('idx_products_company_id')
    companyId: string;
  
    // Many products -> One product category (optional)
    @ManyToOne(() => ProductCategoryEntity, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'category_id' })
    category?: ProductCategoryEntity;
  
    @Column({ name: 'category_id', type: 'uuid', nullable: true })
    @Index('idx_products_category_id')
    categoryId?: string;
  
    @Column({ name: 'product_name', length: 255 })
    productName: string;
  
    @Column({ length: 100, unique: true, nullable: true })
    sku?: string;
  
    @Column({
      name: 'product_type',
      length: 50,
      nullable: true,
      default: 'RawMaterial',
    })
    // possible values: 'RawMaterial', 'FinishedGood', 'Service'
    productType: string;
  
    // Many products -> One unit_of_measure
    @ManyToOne(() => UnitOfMeasureEntity, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'unit_of_measure_id' })
    unitOfMeasure?: UnitOfMeasureEntity;
  
    @Column({ name: 'unit_of_measure_id', type: 'uuid', nullable: true })
    @Index('idx_products_unit_of_measure_id')
    unitOfMeasureId?: string;
  
    @Column({
      name: 'cost_price',
      type: 'numeric',
      precision: 12,
      scale: 2,
      default: 0.0,
    })
    costPrice: number;
  
    @Column({
      name: 'selling_price',
      type: 'numeric',
      precision: 12,
      scale: 2,
      default: 0.0,
    })
    sellingPrice: number;
  
    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive: boolean;

    @OneToMany(() => LotEntity, (lot) => lot.product, {
      cascade: true, // optional, allows related lots to be persisted/updated automatically
    })
    lots: LotEntity[];
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;
  }
  