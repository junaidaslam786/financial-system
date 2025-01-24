import { ApiProperty } from '@nestjs/swagger';

export class LinkInvoiceResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  lotId: string;

  @ApiProperty()
  invoiceId: string;

  @ApiProperty({ type: [String], nullable: true })
  itemIds?: string[];
}