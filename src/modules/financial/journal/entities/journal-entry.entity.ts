import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Company } from './../../../companies/entities/company.entity'; 
  import { User } from './../../../users/entities/user.entity';
  import { JournalLine } from './journal-line.entity';
  
  @Entity('journal_entries')
  export class JournalEntry {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: Company;
  
    @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
    entryDate: Date;
  
    @Column({ length: 100, nullable: true })
    reference?: string;
  
    @Column({ type: 'text', nullable: true })
    description?: string;
  
    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'created_by' })
    createdBy?: User;
  
    /**
     * One JournalEntry -> Many JournalLine
     * Cascade Insert/Update so we can save lines along with the entry in one go.
     */
    @OneToMany(() => JournalLine, (line) => line.journalEntry, {
      cascade: true,
      eager: true, // Eager so lines are automatically loaded with the entry
    })
    lines: JournalLine[];
  
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
  }
  