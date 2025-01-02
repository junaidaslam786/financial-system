export interface ICustomer {
    id?: string;
    companyId: string;
    customerName: string;
    contactInfo?: string;
    customerType?: string;
    creditLimit?: number;
    paymentTerms?: string;
    defaultPriceListId?: string;
    accountId?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  