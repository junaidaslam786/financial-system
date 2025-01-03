import { ApiProperty } from '@nestjs/swagger';

export class LotResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  companyId: string;

  @ApiProperty()
  lotNumber: string;

  @ApiProperty({ nullable: true })
  sourceSupplierId?: string;

  @ApiProperty()
  initialQuantity: number;

  @ApiProperty()
  currentQuantity: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
