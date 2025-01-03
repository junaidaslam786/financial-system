import { ApiProperty } from '@nestjs/swagger';

export class ProductionOrderStageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productionOrderId: string;

  @ApiProperty()
  processingStageId: string;

  @ApiProperty()
  startTime: Date;

  @ApiProperty({ nullable: true })
  endTime?: Date;

  @ApiProperty({ nullable: true })
  inputQuantity?: number;

  @ApiProperty({ nullable: true })
  outputQuantity?: number;

  @ApiProperty({ nullable: true })
  notes?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
