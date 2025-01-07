import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsOptional,
  IsString,
  IsDateString,
  IsIP,
  IsJSON,
} from 'class-validator';

export class CreateAuditTrailDto {
  @ApiProperty({
    description: 'UUID of the user performing this action',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({ description: 'Action description', example: 'CREATE_ORDER' })
  @IsString()
  action: string;

  @ApiProperty({ description: 'Name of the entity', example: 'purchase_orders' })
  @IsString()
  entityName: string;

  @ApiProperty({ description: 'UUID of the entity', required: false })
  @IsUUID()
  @IsOptional()
  entityId?: string;

  @ApiProperty({
    description: 'Timestamp of the action',
    required: false,
    example: '2025-01-01T12:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  actionTimestamp?: string;

  @ApiProperty({
    description: 'IP address of the user',
    required: false,
    example: '192.168.1.10',
  })
  @IsIP()
  @IsOptional()
  ipAddress?: string;

  @ApiProperty({
    description: 'JSON details about the action',
    required: false,
    example: '{"additionalInfo": "some data"}',
  })
  @IsJSON()
  @IsOptional()
  details?: string;
}
