import { PartialType } from '@nestjs/mapped-types';
import { CreateTraderDto } from './create-trader.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTraderDto extends PartialType(CreateTraderDto) {
  @ApiPropertyOptional({ example: 'ABC Trader Updated' })
  traderName?: string;
}
