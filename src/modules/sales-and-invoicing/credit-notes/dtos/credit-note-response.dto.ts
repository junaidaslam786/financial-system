import { ApiProperty } from '@nestjs/swagger';

export class CreditNoteResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  companyId: string;

  @ApiProperty({ required: false })
  invoiceId?: string;

  @ApiProperty()
  noteNumber: string;

  @ApiProperty()
  noteDate: Date;

  @ApiProperty()
  amount: number;

  @ApiProperty({ required: false })
  reason?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
