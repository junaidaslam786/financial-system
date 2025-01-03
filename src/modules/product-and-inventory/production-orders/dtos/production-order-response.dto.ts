import { ApiProperty } from '@nestjs/swagger';

export class ProductionOrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  companyId: string;

  @ApiProperty()
  lotId: string;

  @ApiProperty()
  orderNumber: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty({ nullable: true })
  endDate?: Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
