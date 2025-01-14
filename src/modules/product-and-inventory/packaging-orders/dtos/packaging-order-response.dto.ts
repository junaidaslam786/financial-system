import { ApiProperty } from '@nestjs/swagger';

export class PackagingOrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  company: {
    id: string;
    name: string;
    defaultCurrency: string;
  };

  @ApiProperty({ nullable: true })
  productionOrder: {
    id: string;
    orderNumber: string;
    orderDate: Date;
    expectedDeliveryDate: Date;
    status: string;
  };

  @ApiProperty({ nullable: true })
  orderNumber?: string;

  @ApiProperty({ nullable: true })
  totalQuantity?: number;

  @ApiProperty({ nullable: true })
  bagWeight?: number;

  @ApiProperty({ nullable: true })
  numberOfBags?: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
