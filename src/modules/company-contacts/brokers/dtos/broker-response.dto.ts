import { ApiProperty } from '@nestjs/swagger';

export class BrokerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  company: {
    id: string;
    name: string;
    defaultCurrency: string
  };

  @ApiProperty()
  brokerName: string;

  @ApiProperty({ nullable: true })
  contactInfo?: string;

  @ApiProperty({ nullable: true })
  defaultBrokerageRate?: number;

  @ApiProperty({ nullable: true })
  account: {
    id: string;
    accountName: string;
    accountType: string;
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
