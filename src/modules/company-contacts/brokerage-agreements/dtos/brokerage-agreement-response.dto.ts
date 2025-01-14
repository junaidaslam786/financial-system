import { ApiProperty } from '@nestjs/swagger';

export class BrokerageAgreementResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  broker: {
    id: string;
    brokerName: string;
    contactInfo: string;
  };

  @ApiProperty({ nullable: true })
  agreementName?: string;

  @ApiProperty({ nullable: true })
  brokerageRate?: number;

  @ApiProperty({ nullable: true })
  validFrom?: string | Date;

  @ApiProperty({ nullable: true })
  validTo?: string | Date;
}
