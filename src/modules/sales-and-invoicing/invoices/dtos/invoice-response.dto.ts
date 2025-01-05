import { ApiProperty } from '@nestjs/swagger';

class InvoiceItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  taxRate: number;

  @ApiProperty()
  totalPrice: number;

  @ApiProperty()
  description?: string;
}

export class InvoiceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  companyId: string;

  @ApiProperty()
  customerId?: string;

  @ApiProperty()
  brokerId?: string;

  @ApiProperty()
  invoiceNumber: string;

  @ApiProperty()
  invoiceDate: Date;

  @ApiProperty()
  dueDate?: Date;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  currency?: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  termsAndConditions?: string;

  @ApiProperty()
  notes?: string;

  @ApiProperty({ type: [InvoiceItemResponseDto] })
  items: InvoiceItemResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
