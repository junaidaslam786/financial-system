import { ApiProperty } from '@nestjs/swagger';

export class PackagingOrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  companyId: string;

  @ApiProperty({ nullable: true })
  productionOrderId?: string;

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
