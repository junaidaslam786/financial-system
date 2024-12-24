import { IsString, IsEmail, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  // In normal practice, you'd never accept the raw hashed password from the client.
  // Usually, the hashing occurs in AuthService. This is just a simplified approach
  // or if you have a custom flow to create users with a pre-hashed password.
  @IsString()
  passwordHash: string;

  @IsOptional()
  @IsUUID()
  roleId?: string;

  @IsOptional()
  @IsBoolean()
  twoFactorEnabled?: boolean;

  @IsOptional()
  @IsString()
  twoFactorAuthenticationSecret?: string;
}
