import { ApiProperty } from '@nestjs/swagger';

export class LinkSalesOrderResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  lotId: string;

  @ApiProperty()
  salesOrderId: string;

  @ApiProperty({ type: [String], nullable: true })
  lineIds?: string[];
}