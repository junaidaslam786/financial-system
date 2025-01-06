export interface IPayment {
    id: string;
    companyId: string;
    invoiceId?: string;
    paymentDate: Date;
    amount: number;
    paymentMethod?: string;
    reference?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  