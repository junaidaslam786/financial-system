import { JournalLineDto } from './journal-line.dto';

export class JournalResponseDto {
  id: string;
  companyId: string;
  entryDate: Date;
  reference?: string;
  description?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;

  lines: {
    id: string;
    accountId: string;
    debit: number;
    credit: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
}
