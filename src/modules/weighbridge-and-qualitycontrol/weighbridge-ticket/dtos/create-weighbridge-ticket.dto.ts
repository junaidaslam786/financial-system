import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsDateString,
} from 'class-validator';

export class CreateWeighbridgeTicketDto {
  @ApiProperty({ description: 'UUID of the company', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  companyId: string;

  @ApiProperty({ description: 'Unique ticket number', example: 'WB-0001' })
  @IsString()
  ticketNumber: string;

  @ApiProperty({ description: 'Vehicle number', required: false, example: 'AB12XYZ' })
  @IsString()
  @IsOptional()
  vehicleNumber?: string;

  @ApiProperty({ description: 'Inbound weight', example: 1000.0 })
  @IsNumber()
  @Min(0)
  inboundWeight: number;

  @ApiProperty({ description: 'Outbound weight', example: 200.0 })
  @IsNumber()
  @Min(0)
  outboundWeight: number;

  @ApiProperty({ description: 'Material type (e.g., Grain, Coal)', required: false })
  @IsString()
  @IsOptional()
  materialType?: string;

  @ApiProperty({ description: 'Lot ID (if applicable)', required: false })
  @IsUUID()
  @IsOptional()
  lotId?: string;

  @ApiProperty({ description: 'Date/time of weighbridge entry', required: false })
  @IsOptional()
  @IsDateString()
  date?: string;
}
