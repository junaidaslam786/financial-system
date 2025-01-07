import { ApiProperty } from '@nestjs/swagger';
import { InvoiceItemResponseDto } from './invoice-item-response.dto';

export class InvoiceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  companyId: string;

  @ApiProperty({ required: false })
  customerId?: string;

  @ApiProperty({ required: false })
  brokerId?: string;

  @ApiProperty()
  invoiceNumber: string;

  @ApiProperty()
  invoiceDate: Date;

  @ApiProperty({ required: false })
  dueDate?: Date;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty({ required: false })
  currency?: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ required: false })
  termsAndConditions?: string;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty({ type: [InvoiceItemResponseDto] })
  items: InvoiceItemResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
