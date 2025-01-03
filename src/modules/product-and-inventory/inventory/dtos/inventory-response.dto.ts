import { ApiProperty } from '@nestjs/swagger';

export class InventoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  companyId: string;

  @ApiProperty({ nullable: true })
  warehouseId?: string;

  @ApiProperty({ nullable: true })
  productId?: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty({ nullable: true })
  batchNumber?: string;

  @ApiProperty({ nullable: true })
  expirationDate?: string | Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
