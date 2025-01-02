import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
  } from 'typeorm';
  
  @Entity({ name: 'contacts' })
  export class ContactEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({
      name: 'entity_type',
      length: 50,
      comment: "One of 'Customer','Supplier','Trader','Broker','Partner'",
    })
    entityType: string;
  
    @Column({ name: 'entity_id', type: 'uuid' })
    entityId: string;
  
    @Column({ name: 'contact_name', length: 255, nullable: true })
    contactName?: string;
  
    @Column({ length: 50, nullable: true })
    phone?: string;
  
    @Column({ length: 150, nullable: true })
    email?: string;
  
    @Column({ type: 'text', nullable: true })
    address?: string;
  
    @Column({ name: 'is_primary', type: 'boolean', default: false })
    isPrimary: boolean;
  }
  