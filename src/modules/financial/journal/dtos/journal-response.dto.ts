import { JournalLineDto } from './journal-line.dto';

export class JournalResponseDto {
  id: string;
  company: {
    id: string;
    name: string;
    defaultCurrency: string;
  };
  entryDate: Date;
  reference?: string;
  description?: string;
  createdBy: {
    id: string;
    username: string;
  };
  createdAt: Date;
  updatedAt: Date;

  lines: {
    id: string;
    account: {
      id: string;
      accountName: string;
      accountType: string;
    };
    debit: number;
    credit: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
}
