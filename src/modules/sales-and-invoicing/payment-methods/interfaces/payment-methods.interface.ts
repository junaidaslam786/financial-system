export interface IPaymentMethod {
    id: string;
    companyId: string;
    methodName: string;
    details?: string;
    createdAt: Date;
  }
  