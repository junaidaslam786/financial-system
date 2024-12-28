import { IsString, IsOptional, IsInt, Min, Max, Length } from 'class-validator';

export class CreateCurrencyDto {
  @IsString()
  @Length(1, 10)
  currencyCode: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  currencyName?: string;

  @IsOptional()
  @IsString()
  @Length(0, 10)
  symbol?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  decimalPlaces?: number;
}
