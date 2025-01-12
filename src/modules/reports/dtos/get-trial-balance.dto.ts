// src/modules/reports/dtos/get-trial-balance.dto.ts
import { IsDate, IsOptional, IsString } from 'class-validator';

export class GetTrialBalanceDto {
  @IsOptional()
  @IsDate()
  startDate?: Date; // e.g. '2025-01-01'

  @IsOptional()
  @IsDate()
  endDate?: Date; // e.g. '2025-12-31'

  @IsOptional()
  @IsString()
  companyId?: string;
}
