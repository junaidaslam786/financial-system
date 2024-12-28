import { IsString, IsOptional, Length } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  companyId: string; // or pass as part of route if you prefer

  @IsString()
  @Length(1, 255)
  accountName: string;

  @IsString()
  @Length(1, 100)
  accountType: string;

  @IsOptional()
  @IsString()
  parentAccountId?: string;

  @IsOptional()
  @IsString()
  @Length(0, 10)
  currency?: string;
}
