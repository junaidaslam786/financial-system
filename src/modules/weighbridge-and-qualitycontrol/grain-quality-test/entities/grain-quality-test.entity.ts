import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
  } from 'typeorm';
  import { ApiProperty } from '@nestjs/swagger';
import { LotEntity } from 'src/modules/product-and-inventory/lots/entities/lot.entity';
  
  @Entity('grain_quality_tests')
  export class GrainQualityTest {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => LotEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'lot_id' })
    lot?: LotEntity;
  
    @ApiProperty()
    @Column({ name: 'moisture_content', type: 'numeric', precision: 5, scale: 2, default: 0 })
    moistureContent: number;
  
    @ApiProperty()
    @Column({ name: 'broken_grains_percentage', type: 'numeric', precision: 5, scale: 2, default: 0 })
    brokenGrainsPercentage: number;
  
    @ApiProperty()
    @Column({ name: 'foreign_matter_percentage', type: 'numeric', precision: 5, scale: 2, default: 0 })
    foreignMatterPercentage: number;
  
    @ApiProperty({ required: false })
    @Column({ type: 'text', nullable: true })
    notes?: string;
  
    @ApiProperty()
    @Column({ name: 'test_date', type: 'timestamptz', default: () => 'NOW()' })
    testDate: Date;
  
    @ApiProperty()
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
  }
  