export interface ISupplier {
    id?: string;
    companyId: string;
    supplierName: string;
    contactInfo?: string;
    paymentTerms?: string;
    defaultPriceListId?: string;
    accountId?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  