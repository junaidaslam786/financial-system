import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
    Check,
  } from 'typeorm';
  import { Company } from '../../../companies/entities/company.entity';
  import { WorkflowTransition } from './workflow-transition.entity';
  import { ApiProperty } from '@nestjs/swagger';
  
  @Entity('workflows')
  export class Workflow {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Company, { onDelete: 'NO ACTION' })
    @JoinColumn({ name: 'company_id' })
    company: Company;
  
    @ApiProperty({ required: false })
    @Column({ name: 'document_type', type: 'varchar', length: 50, nullable: true })
    documentType?: string;
  
    @ApiProperty()
    @Column({ name: 'state_name', type: 'varchar', length: 50 })
    stateName: string;
  
    @ApiProperty()
    @Column({ name: 'is_initial', type: 'boolean', default: false })
    isInitial: boolean;
  
    @ApiProperty()
    @Column({ name: 'is_final', type: 'boolean', default: false })
    isFinal: boolean;
  
    @OneToMany(() => WorkflowTransition, (transition) => transition.workflow, { cascade: true })
    transitions: WorkflowTransition[];
  }
  