import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateBrokerageAgreementDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Broker ID' })
  @IsUUID()
  brokerId: string;

  @ApiProperty({ example: 'My Brokerage Agreement', required: false })
  @IsOptional()
  @IsString()
  agreementName?: string;

  @ApiProperty({ example: 2.5, description: 'Brokerage rate' })
  @IsOptional()
  @IsNumber()
  brokerageRate?: number;

  @ApiProperty({ example: '2025-01-01', required: false })
  @IsOptional()
  validFrom?: string; // or Date

  @ApiProperty({ example: '2025-12-31', required: false })
  @IsOptional()
  validTo?: string; // or Date
}
