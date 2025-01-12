import { IsDate, IsOptional, IsString } from 'class-validator';

export class GetIncomeStatementDto {
  @IsString()
  companyId: string;

  @IsOptional()
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @IsDate()
  endDate?: Date;
}