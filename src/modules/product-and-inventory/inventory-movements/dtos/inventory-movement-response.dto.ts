import { ApiProperty } from '@nestjs/swagger';

export class InventoryMovementResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  companyId: string;

  @ApiProperty({ nullable: true })
  inventoryId?: string;

  @ApiProperty({ nullable: true })
  movementType?: string;

  @ApiProperty({ nullable: true })
  quantity?: number;

  @ApiProperty({ nullable: true })
  reason?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
