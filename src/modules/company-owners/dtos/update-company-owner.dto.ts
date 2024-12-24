import { IsString, IsOptional, IsNumber, Max, Min } from 'class-validator';

export class UpdateCompanyOwnerDto {
  @IsOptional()
  @IsString()
  ownerName?: string;

  @IsOptional()
  @IsString()
  contactInfo?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  ownershipPercentage?: number;
}
