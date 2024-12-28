import { IJournalLine } from './journal-line.interface';

export interface IJournalEntry {
  id?: string;
  companyId: string; // or a Company object reference
  entryDate?: Date;
  reference?: string;
  description?: string;
  createdBy?: string; // userId
  lines?: IJournalLine[];
}
