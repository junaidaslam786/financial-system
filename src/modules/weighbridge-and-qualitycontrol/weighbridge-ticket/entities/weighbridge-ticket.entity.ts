import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
  } from 'typeorm';
  import { Company } from '../../../companies/entities/company.entity';
  import { ApiProperty } from '@nestjs/swagger';
import { LotEntity } from 'src/modules/product-and-inventory/lots/entities/lot.entity';
  
  @Entity('weighbridge_tickets')
  export class WeighbridgeTicket {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: Company;
  
    @ApiProperty()
    @Column({ name: 'ticket_number', type: 'varchar', length: 100, unique: true })
    ticketNumber: string;
  
    @ApiProperty({ required: false })
    @Column({ name: 'vehicle_number', type: 'varchar', length: 100, nullable: true })
    vehicleNumber?: string;
  
    @ApiProperty()
    @Column({ name: 'inbound_weight', type: 'numeric', precision: 15, scale: 2, default: 0 })
    inboundWeight: number;
  
    @ApiProperty()
    @Column({ name: 'outbound_weight', type: 'numeric', precision: 15, scale: 2, default: 0 })
    outboundWeight: number;
  
    @ApiProperty()
    @Column({
      name: 'net_weight',
      type: 'numeric',
      precision: 15,
      scale: 2,
      generatedType: 'STORED',
      asExpression: `"inbound_weight" - "outbound_weight"`,
    })
    netWeight: number;
  
    @ApiProperty({ required: false })
    @Column({ name: 'material_type', type: 'varchar', length: 100, nullable: true })
    materialType?: string;
  
    @ManyToOne(() => LotEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'lot_id' })
    lot?: LotEntity;
  
    @ApiProperty()
    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    date: Date;
  
    @ApiProperty()
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
  }
  