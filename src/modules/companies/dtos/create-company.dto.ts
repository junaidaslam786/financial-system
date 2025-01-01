import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateCompanyDto {
   @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: false })  
  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  legalStructure?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  contactInfo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  defaultCurrency?: string;
}
