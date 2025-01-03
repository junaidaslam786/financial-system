import { PartialType } from '@nestjs/mapped-types';
import { CreateProcessingStageDto } from './create-processing-stage.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProcessingStageDto extends PartialType(CreateProcessingStageDto) {
  @ApiPropertyOptional({ example: 'Milling - Updated' })
  @IsOptional()
  @IsString()
  stageName?: string;
}
