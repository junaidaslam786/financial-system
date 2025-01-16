import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateTraderDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  companyId: string;

  @ApiProperty({ example: 'ABC Traders' })
  @IsString()
  @IsNotEmpty()
  traderName: string;

  @ApiProperty({ example: 'Main Street, City, etc.' })
  @IsOptional()
  contactInfo?: string;

  @ApiProperty({ example: 'Net 30' })
  @IsOptional()
  commissionRate?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Account ID' })
  @IsUUID()
  @IsOptional()
  accountId?: string;

  @ApiProperty({ example: '+1-555-123-4567' })
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'trader email'})
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'trader address' })
  @IsOptional()
  address?: string;
  
}
