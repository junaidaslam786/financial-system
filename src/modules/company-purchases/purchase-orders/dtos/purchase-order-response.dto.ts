import { ApiProperty } from '@nestjs/swagger';
import { PurchaseOrderLineResponseDto } from './purchase-order-line-response.dto';
import { SupplierEntity } from 'src/modules/company-contacts/suppliers/entities/supplier.entity';
import { BrokerEntity } from 'src/modules/company-contacts/brokers/entities/broker.entity';


export class PurchaseOrderResponseDto {
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
    contactInfo: string;
  };

  @ApiProperty({ required: false })
  broker: {
    id: string;
    brokerName: string;
    contactInfo: string
  };

  @ApiProperty()
  orderNumber: string;

  @ApiProperty()
  orderDate: string | Date;

  @ApiProperty({ required: false })
  expectedDeliveryDate?: string | Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: () => [PurchaseOrderLineResponseDto] })
  lines: PurchaseOrderLineResponseDto[];

 
}
