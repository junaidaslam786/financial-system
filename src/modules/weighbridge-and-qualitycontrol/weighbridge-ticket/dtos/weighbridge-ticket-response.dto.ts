import { ApiProperty } from '@nestjs/swagger';

export class WeighbridgeTicketResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  companyId: string;

  @ApiProperty()
  ticketNumber: string;

  @ApiProperty({ required: false })
  vehicleNumber?: string;

  @ApiProperty()
  inboundWeight: number;

  @ApiProperty()
  outboundWeight: number;

  @ApiProperty()
  netWeight: number;

  @ApiProperty({ required: false })
  materialType?: string;

  @ApiProperty({ required: false })
  lotId?: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  createdAt: Date;
}
