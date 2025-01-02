import { ApiProperty } from '@nestjs/swagger';

export class BrokerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  companyId: string;

  @ApiProperty()
  brokerName: string;

  @ApiProperty({ nullable: true })
  contactInfo?: string;

  @ApiProperty({ nullable: true })
  defaultBrokerageRate?: number;

  @ApiProperty({ nullable: true })
  accountId?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
