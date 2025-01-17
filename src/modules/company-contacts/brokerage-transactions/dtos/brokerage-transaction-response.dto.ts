import { ApiProperty } from '@nestjs/swagger';

export class BrokerageTransactionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  broker: {
    id: string;
    brokerName: string;
    contactInfo: string;
  };

  @ApiProperty({ nullable: true })
  relatedDocumentId?: string;

  @ApiProperty()
  documentType: string; // 'Invoice', 'PurchaseOrder', 'SalesOrder'

  @ApiProperty({ nullable: true })
  brokerageAmount?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
