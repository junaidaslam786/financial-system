import { ApiProperty } from '@nestjs/swagger';

export class CustomerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  company: {
    id: string;
    name: string;
    defaultCurrency: string;
  };

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
  defaultPriceList: {
    id: string;
    listName: string;
    currency: string;
  };

  @ApiProperty({ nullable: true })
  account: {
    id: string;
    accountName: string;
    accountType: string;
    currency: string;
  };

  @ApiProperty({ nullable: true })
  phone: string;

  @ApiProperty({ nullable: true })
  email: string;

  @ApiProperty({ nullable: true })
  address: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
