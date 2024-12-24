import { IsEmail, IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsUUID()
  roleId?: string; // optionally assign a role on registration
}
