import { PartialType } from '@nestjs/mapped-types';
import { CreateLotDto } from './create-lot.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLotDto extends PartialType(CreateLotDto) {
  @ApiPropertyOptional({ example: 500, description: 'Update the currentQuantity' })
  currentQuantity?: number;

  @ApiPropertyOptional({ example: 'In-Process' })
  status?: string;
}
