// create-partner.dto.ts
import { IsUUID, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreatePartnerDto {
  @IsUUID()
  companyId: string;

  @IsString()
  partnerName: string;

  @IsOptional()
  @IsNumber()
  investmentAmount?: number;

  @IsOptional()
  @IsNumber()
  shares?: number;

  @IsOptional()
  @IsString()
  partnerType?: string;
}
