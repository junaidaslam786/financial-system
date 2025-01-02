import { ApiProperty } from '@nestjs/swagger';

export class SupplierResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  companyId: string;

  @ApiProperty()
  traderName: string;

  @ApiProperty({ nullable: true })
  contactInfo?: string;

  @ApiProperty({ nullable: true })
  commissionRate?: string;

  @ApiProperty({ nullable: true })
  accountId?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
