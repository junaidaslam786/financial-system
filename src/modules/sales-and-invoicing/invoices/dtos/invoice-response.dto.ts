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
  supplier: {
    id: string;
    supplierName: string;
    ContactInfo: string;
    account: {
      id: string;
      accountName: string;
      accountType: string;
    }
  };

  @ApiProperty({ required: false })
  customer: {
    id: string;
    customerName: string;
    customerInfo: string;
    account: {
      id: string;
      accountName: string;
      accountType: string;
    }
  }

  @ApiProperty({ required: false })
  broker: {
    id: string;
    brokerName: string;
    ContactInfo: string;
    account: {
      id: string;
      accountName: string;
      accountType: string;
    }
  };

  @ApiProperty({ required: false })
  salesOrder: {
    id: string;
    orderNumber: string;
    orderDate: Date;
    totalAmount: number;
    status: string;
    lines: {
      id: string;
      product: {
        id: string;
        productName: string;
        productType: string;
      };
      quantity: number;
      unitPrice: number;
      totalLineAmount: number;
    }[];
  };

  @ApiProperty({ required: false })
  purchaseOrder: {
    id: string;
    orderNumber: string;
    orderDate: Date;
    expectedDeliveryDate: Date;
    status: string;
    lines: {
      id: string;
      product: {
        id: string;
        productName: string;
        productType: string;
      };
      quantity: number;
      unitPrice: number;
      totalLineAmount: number;
    }[];
  };

  @ApiProperty()
  invoiceNumber: string;

  @ApiProperty()
  invoiceType: string;

  @ApiProperty()
  invoiceDate: Date;

  @ApiProperty({ required: false })
  journalEntry: {
    id: string;
    reference: string;
    entryDate: Date;
    lines: {
      id: string;
      account: {
        id: string;
        accountName: string;
        accountType: string;
      };
      debitAmount: number;
      creditAmount: number;
    }[];
  };

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
