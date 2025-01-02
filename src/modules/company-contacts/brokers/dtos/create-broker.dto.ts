import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateBrokerDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Company ID' })
  @IsUUID()
  companyId: string;

  @ApiProperty({ example: 'John Broker' })
  @IsString()
  brokerName: string;

  @ApiProperty({ example: 'Some contact info', required: false })
  @IsOptional()
  @IsString()
  contactInfo?: string;

  @ApiProperty({ example: 2.5, description: 'Default brokerage rate' })
  @IsOptional()
  @IsNumber()
  defaultBrokerageRate?: number;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Account ID' })
  @IsOptional()
  @IsUUID()
  accountId?: string;
}
