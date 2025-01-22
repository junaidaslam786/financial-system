import { ApiProperty } from '@nestjs/swagger';

export class PaymentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  company: {
    id: string;
    name: string;
    defaultCurrency: string;
  };

  @ApiProperty({ required: false })
  invoice: {
    id: string;
    invoiceNumber: string;
    invoiceType: string;
    dueDate: Date;
    totalAmount: number;
    status: string;
  };

  @ApiProperty()
  paymentDate: Date;

  @ApiProperty()
  amount: number;

  @ApiProperty({ required: false })
  paymentMethod: {
    id: string;
    methodName: string;
    details: string;
  };

  @ApiProperty({ required: false })
  journalEntry: {
    id: string;
    description: string;
    entryDate: Date;
  };

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
