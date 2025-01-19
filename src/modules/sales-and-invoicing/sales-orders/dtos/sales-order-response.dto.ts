import { ApiProperty } from '@nestjs/swagger';

export class SalesOrderLineResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  product: {
    id: string;
    productName: string;
    productType: string;
  };

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  taxRate: number;

  @ApiProperty()
  totalLineAmount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class SalesOrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  company: {
    id: string;
    name: string;
    defaultCurrency: string;
  };

  @ApiProperty({ required: false })
  customer:{
    id: string;
    customerName: string;
    commissionRate: number;
  };

  @ApiProperty({ required: false })
  trader: {
    id: string;
    traderName: string;
    traderType: string;
  };

  @ApiProperty()
  orderNumber: string;

  @ApiProperty()
  orderDate: Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  autoInvoicing: boolean;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty({ required: false })
  broker: {
    id: string;
    brokerName: string;
  };

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [SalesOrderLineResponseDto] })
  lines: SalesOrderLineResponseDto[];
}
