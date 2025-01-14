import { ApiProperty } from '@nestjs/swagger';
import { InvoiceItemResponseDto } from './invoice-item-response.dto';

export class InvoiceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  company: {
    id: string;
    name: string;
    defaultCurrency: string;
  };

  @ApiProperty({ required: false })
  customer: {
    id: string;
    customerName: string;
    customerInfo: string;
  }

  @ApiProperty({ required: false })
  broker: {
    id: string;
    brokerName: string;
    ContactInfo: string
  };

  @ApiProperty()
  invoiceNumber: string;

  @ApiProperty()
  invoiceType: string;

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
