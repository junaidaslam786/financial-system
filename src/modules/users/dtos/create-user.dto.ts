import { IsString, IsEmail, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  passwordHash?: string;

  // The plain password provided by the client. It is optional here if you want to support
  // scenarios where a hashed password might be passed (rarely) or leave it required if needed.
  @IsOptional()
  @IsString()
  password?: string;

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
