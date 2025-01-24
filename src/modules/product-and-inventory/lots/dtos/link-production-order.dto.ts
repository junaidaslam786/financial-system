import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class LinkProductionOrderDto {
  @ApiProperty({ description: 'UUID of the Production Order' })
  @IsUUID()
  productionOrderId: string;

  @ApiProperty({ description: 'UUID of the Lot' })
  @IsUUID()
  lotId: string;
}