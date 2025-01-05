import { ApiProperty } from '@nestjs/swagger';

export class SalesOrderLineResponseDto {
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
  companyId: string;

  @ApiProperty({ required: false })
  customerId?: string;

  @ApiProperty({ required: false })
  traderId?: string;

  @ApiProperty()
  orderNumber: string;

  @ApiProperty()
  orderDate: Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty({ required: false })
  brokerageId?: string;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [SalesOrderLineResponseDto] })
  lines: SalesOrderLineResponseDto[];
}
