export interface IUser {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    roleId?: string;
    twoFactorEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  