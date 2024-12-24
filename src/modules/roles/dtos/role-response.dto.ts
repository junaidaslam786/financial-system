import { RoleEntity } from '../entities/role.entity';

export class RoleResponseDto {
  constructor(role: RoleEntity) {
    this.id = role.id;
    this.roleName = role.roleName;
  }

  id: string;
  roleName: string;
}
