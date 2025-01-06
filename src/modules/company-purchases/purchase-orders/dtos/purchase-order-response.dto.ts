import { ApiProperty } from '@nestjs/swagger';
import { PurchaseOrderLineResponseDto } from './purchase-order-line-response.dto';
import { SupplierEntity } from 'src/modules/company-contacts/suppliers/entities/supplier.entity';
import { BrokerEntity } from 'src/modules/company-contacts/brokers/entities/broker.entity';


export class PurchaseOrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  companyId: string;

  @ApiProperty({ required: false })
  supplierId?: string;

  @ApiProperty({ required: false })
  brokerId?: string;

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

  // If you want the full objects instead of just IDs:
  @ApiProperty({ type: () => SupplierEntity, required: false })
  supplier?: SupplierEntity;

  @ApiProperty({ type: () => BrokerEntity, required: false })
  broker?: BrokerEntity;
}
