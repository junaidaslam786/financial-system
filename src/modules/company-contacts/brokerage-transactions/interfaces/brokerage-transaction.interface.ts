export interface IBrokerageTransaction {
    id?: string;
    brokerId: string;
    relatedDocumentId?: string;
    documentType?: string;
    brokerageAmount?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  