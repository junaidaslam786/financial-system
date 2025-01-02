import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, IsBoolean, IsIn } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({
    example: 'Supplier',
    enum: ['Customer', 'Supplier', 'Trader', 'Broker', 'Partner'],
  })
  @IsString()
  @IsIn(['Customer', 'Supplier', 'Trader', 'Broker', 'Partner'])
  entityType: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Entity ID' })
  @IsUUID()
  entityId: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  contactName?: string;

  @ApiProperty({ example: '+1-555-123-4567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'john@example.com', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: '123 Main Street', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
