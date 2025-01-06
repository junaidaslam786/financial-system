export interface ITransactionsPayment {
    id: string;
    relatedTransactionId?: string;
    paymentMethodId?: string;
    amount: number;
    paymentDate: Date;
    createdAt: Date;
    updatedAt: Date;
  }
  