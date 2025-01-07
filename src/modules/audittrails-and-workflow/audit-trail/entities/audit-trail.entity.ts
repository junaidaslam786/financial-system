import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
  } from 'typeorm';
  import { User } from '../../../users/entities/user.entity'; // Adjust path
  import { ApiProperty } from '@nestjs/swagger';
  
  @Entity('audit_trails')
  export class AuditTrail {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => User, { nullable: true, onUpdate: 'CASCADE', onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user?: User;
  
    @ApiProperty()
    @Column({ type: 'text' })
    action: string;
  
    @ApiProperty()
    @Column({ name: 'entity_name', type: 'text' })
    entityName: string;
  
    @ApiProperty({ required: false })
    @Column({ name: 'entity_id', type: 'uuid', nullable: true })
    entityId?: string;
  
    @ApiProperty()
    @CreateDateColumn({ name: 'action_timestamp', type: 'timestamptz' })
    actionTimestamp: Date;
  
    @ApiProperty({ required: false })
    @Column({ name: 'ip_address', type: 'inet', nullable: true })
    ipAddress?: string;
  
    @ApiProperty({ required: false })
    @Column({ type: 'jsonb', nullable: true })
    details?: any;
  }
  