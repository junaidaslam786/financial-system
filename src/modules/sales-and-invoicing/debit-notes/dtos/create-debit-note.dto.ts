import { ApiProperty } from '@nestjs/swagger';

export class CreateDebitNoteDto {
  @ApiProperty({ description: 'Company ID for this debit note' })
  companyId: string;

  @ApiProperty({ description: 'Invoice ID to which this debit note applies', required: false })
  invoiceId?: string;

  @ApiProperty({ description: 'Unique debit note number', example: 'DN-2025-0001' })
  noteNumber: string;

  @ApiProperty({ description: 'Date of the debit note', example: '2025-01-05' })
  noteDate: Date;

  @ApiProperty({ description: 'Amount of the debit note', example: 200.0 })
  amount: number;

  @ApiProperty({ description: 'Reason for issuing the debit note', required: false })
  reason?: string;
}
