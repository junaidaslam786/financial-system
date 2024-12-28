import { IsString, IsNumber, IsOptional, IsDateString, Length } from 'class-validator';

export class CreateExchangeRateDto {
  @IsString()
  @Length(1, 10)
  baseCurrency: string;

  @IsString()
  @Length(1, 10)
  targetCurrency: string;

  @IsNumber()
  rate: number;

  @IsOptional()
  @IsDateString()
  effectiveDate?: string; // or Date
}
