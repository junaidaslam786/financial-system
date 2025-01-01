// create-partner.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreatePartnerDto {
  @ApiProperty({ required: true })
  @IsUUID()
  companyId: string;

  @ApiProperty({ required: true })
  @IsString()
  partnerName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  investmentAmount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  shares?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  partnerType?: string;
}
