export interface IDebitNote {
    id: string;
    companyId: string;
    invoiceId?: string;
    noteNumber: string;
    noteDate: Date;
    amount: number;
    reason?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  