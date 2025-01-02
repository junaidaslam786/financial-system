import { ApiProperty } from '@nestjs/swagger';

export class SupplierResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  companyId: string;

  @ApiProperty()
  supplierName: string;

  @ApiProperty({ nullable: true })
  contactInfo?: string;

  @ApiProperty({ nullable: true })
  paymentTerms?: string;

  @ApiProperty({ nullable: true })
  defaultPriceListId?: string;

  @ApiProperty({ nullable: true })
  accountId?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
