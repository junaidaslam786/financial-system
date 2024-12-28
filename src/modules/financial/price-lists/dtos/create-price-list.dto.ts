import { IsString, IsOptional, IsBoolean, Length } from 'class-validator';

export class CreatePriceListDto {
  @IsString()
  companyId: string;

  @IsString()
  @Length(1, 100)
  listName: string;

  @IsOptional()
  @IsString()
  @Length(0, 10)
  currency?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
