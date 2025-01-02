export interface IBrokerageAgreement {
    id?: string;
    brokerId: string;
    agreementName?: string;
    brokerageRate?: number;
    validFrom?: Date | string;
    validTo?: Date | string;
  }
  