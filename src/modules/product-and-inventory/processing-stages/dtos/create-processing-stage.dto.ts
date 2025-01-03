import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateProcessingStageDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Company ID' })
  @IsUUID()
  companyId: string;

  @ApiProperty({ example: 'Milling', description: 'Name of the processing stage' })
  @IsString()
  stageName: string;

  @ApiPropertyOptional({ example: 'This stage involves milling the grain.' })
  @IsOptional()
  @IsString()
  description?: string;
}
