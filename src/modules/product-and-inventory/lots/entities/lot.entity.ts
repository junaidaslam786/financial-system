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
  import { SupplierEntity } from './../../../company-contacts/suppliers/entities/supplier.entity';
  
  @Entity({ name: 'lots' })
  export class LotEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    // Many lots -> One company
    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: Company;
  
    @Column({ name: 'company_id', type: 'uuid' })
    @Index('idx_lots_company_id')
    companyId: string;
  
    @Column({ name: 'lot_number', length: 100, unique: true })
    lotNumber: string;
  
    // Optional relation to a supplier (raw paddy source)
    @ManyToOne(() => SupplierEntity, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'source_supplier_id' })
    sourceSupplier?: SupplierEntity;
  
    @Column({ name: 'source_supplier_id', type: 'uuid', nullable: true })
    @Index('idx_lots_source_supplier_id')
    sourceSupplierId?: string;
  
    @Column({
      name: 'initial_quantity',
      type: 'numeric',
      precision: 15,
      scale: 2,
    })
    initialQuantity: number;
  
    @Column({
      name: 'current_quantity',
      type: 'numeric',
      precision: 15,
      scale: 2,
    })
    currentQuantity: number;
  
    @Column({
      name: 'status',
      length: 50,
      default: 'Pending',
    })
    // possible values: 'Pending', 'In-Process', 'Completed'
    status: string;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;
  }
  