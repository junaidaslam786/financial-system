import { PartialType } from '@nestjs/mapped-types';
import { CreateLotRawMaterialDto } from './create-lot-raw-material.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateLotRawMaterialDto extends PartialType(CreateLotRawMaterialDto) {
  @ApiPropertyOptional({ example: 150.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;
}
