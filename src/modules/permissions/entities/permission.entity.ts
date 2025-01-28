import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from 'typeorm';
  import { RolePermission } from './role-permission.entity';
  import { ApiProperty } from '@nestjs/swagger';
  
  @Entity('permissions')
  export class Permission {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ApiProperty({ description: 'A unique name for this permission, e.g. purchase.create' })
    @Column({ name: 'permission_name', unique: true })
    permissionName: string;
  
    @ApiProperty({ required: false })
    @Column({ type: 'text', nullable: true })
    description?: string;
  
    @OneToMany(() => RolePermission, (rp) => rp.permission, { cascade: true })
    rolePermissions: RolePermission[];
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }