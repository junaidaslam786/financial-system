export interface IBroker {
    id?: string;
    companyId: string;
    brokerName: string;
    contactInfo?: string;
    defaultBrokerageRate?: number;
    accountId?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  