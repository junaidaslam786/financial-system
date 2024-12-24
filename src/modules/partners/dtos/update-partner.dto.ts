// update-partner.dto.ts
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdatePartnerDto {
  @IsOptional()
  @IsString()
  partnerName?: string;

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
