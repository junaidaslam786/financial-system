import { IsDate, IsOptional, IsString } from 'class-validator';

export class GetBalanceSheetDto {
  @IsString()
  companyId: string;

  @IsOptional()
  @IsDate()
  endDate?: Date;
}