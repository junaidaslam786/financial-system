import { ApiProperty } from '@nestjs/swagger';

export class LinkPurchaseOrderResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  lotId: string;

  @ApiProperty()
  purchaseOrderId: string;

  @ApiProperty({ type: [String], nullable: true })
  lineIds?: string[];
}