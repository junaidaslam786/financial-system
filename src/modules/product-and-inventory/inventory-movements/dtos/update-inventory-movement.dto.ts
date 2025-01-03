import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryMovementDto } from './create-inventory-movement.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsIn, IsNumber, Min } from 'class-validator';

export class UpdateInventoryMovementDto extends PartialType(CreateInventoryMovementDto) {
  @ApiPropertyOptional({ example: 'OUT', enum: ['IN','OUT','ADJUSTMENT'] })
  @IsOptional()
  @IsIn(['IN','OUT','ADJUSTMENT'])
  movementType?: string;

  @ApiPropertyOptional({ example: 50.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;
}
