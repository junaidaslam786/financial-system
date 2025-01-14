import { ApiProperty } from '@nestjs/swagger';

export class SupplierResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  company: {
    id: string;
    name: string;
    defaultCurrency: string;
  };

  @ApiProperty()
  traderName: string;

  @ApiProperty({ nullable: true })
  contactInfo?: string;

  @ApiProperty({ nullable: true })
  commissionRate?: string;

  @ApiProperty({ nullable: true })
  account: {
    id: string;
    accountName: string;
    accountType: string;
    currency: string;
  };

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
