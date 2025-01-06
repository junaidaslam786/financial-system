import { ApiProperty } from '@nestjs/swagger';

export class CreateCreditNoteDto {
  @ApiProperty({ description: 'Company ID owning this credit note' })
  companyId: string;

  @ApiProperty({ description: 'Invoice ID to which this credit note applies', required: false })
  invoiceId?: string;

  @ApiProperty({ description: 'Unique credit note number', example: 'CN-2025-0001' })
  noteNumber: string;

  @ApiProperty({ description: 'Date of the credit note', example: '2025-01-05' })
  noteDate: Date;

  @ApiProperty({ description: 'Amount of the credit note', example: 150.0 })
  amount: number;

  @ApiProperty({ description: 'Reason for issuing the credit note', required: false })
  reason?: string;
}
