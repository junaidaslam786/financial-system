import { ApiProperty } from '@nestjs/swagger';

export class CustomerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  companyId: string;

  @ApiProperty()
  customerName: string;

  @ApiProperty({ nullable: true })
  contactInfo?: string;

  @ApiProperty({ nullable: true })
  customerType?: string;

  @ApiProperty({ nullable: true })
  creditLimit?: number;

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
