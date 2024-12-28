import { User } from '../entities/user.entity';

export class UserResponseDto {
  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.roleName = user.role?.roleName;
    this.twoFactorEnabled = user.twoFactorEnabled;
  }

  id: string;
  username: string;
  email: string;
  roleName?: string;
  twoFactorEnabled: boolean;
}
