import { ApiProperty } from '@nestjs/swagger';

export class PurchaseOrderLineResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  product: {
    id: string;
    productName: string;
    productType: string;
  };

  @ApiProperty({ required: false })
  lot: {
    id: string;
    lotNumber: string;
  };

  @ApiProperty()
  purchaseOrder: {
    id: string;
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
    orderNumber: string;
    orderDate: Date;
    expectedDeliveryDate: Date;
    status: string;
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
}
