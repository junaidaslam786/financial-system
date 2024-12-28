export interface IAccount {
    id?: string;
    companyId: string;
    accountName: string;
    accountType: string;
    parentAccountId?: string;
    currency?: string;
  }
  