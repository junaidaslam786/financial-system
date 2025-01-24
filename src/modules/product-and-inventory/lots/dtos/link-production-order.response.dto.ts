import { ApiProperty } from '@nestjs/swagger';

export class LinkProductionOrderResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  productionOrderId: string;

  @ApiProperty()
  lotId: string;
}