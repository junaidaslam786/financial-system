import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Permission } from './permission.entity';
import { RoleEntity } from 'src/modules/roles/entities/role.entity';

@Entity('role_permissions')
export class RolePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => RoleEntity, (role) => role.rolePermissions, { onDelete: 'CASCADE' })
  role: RoleEntity;

  @ManyToOne(() => Permission, (perm) => perm.rolePermissions, { onDelete: 'CASCADE' })
  permission: Permission;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}