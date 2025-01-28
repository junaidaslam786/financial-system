import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { RolePermission } from 'src/modules/permissions/entities/role-permission.entity';


@Entity({ name: 'roles' })
@Index('idx_roles_rolename', ['roleName'])
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'role_name', unique: true, length: 100 })
  roleName: string;

  @OneToMany(() => RolePermission, (rp) => rp.role, { cascade: true })
  rolePermissions: RolePermission[];

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
