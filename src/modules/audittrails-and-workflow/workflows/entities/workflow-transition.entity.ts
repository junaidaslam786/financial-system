import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Workflow } from './workflow.entity';
  import { ApiProperty } from '@nestjs/swagger';
  
  @Entity('workflow_transitions')
  export class WorkflowTransition {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Workflow, (workflow) => workflow.transitions, {
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'workflow_id' })
    workflow: Workflow;
  
    @ApiProperty()
    @Column({ name: 'from_state', type: 'varchar', length: 50 })
    fromState: string;
  
    @ApiProperty()
    @Column({ name: 'to_state', type: 'varchar', length: 50 })
    toState: string;
  
    @ApiProperty({ required: false })
    @Column({ name: 'transition_name', type: 'varchar', length: 100, nullable: true })
    transitionName?: string;
  }
  