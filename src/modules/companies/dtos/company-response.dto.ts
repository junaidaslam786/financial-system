import { Company } from '../entities/company.entity';

export class CompanyResponseDto {
  id: string;
  name: string;
  registrationNumber?: string;
  legalStructure?: string;
  address?: string;
  contactInfo?: string;
  defaultCurrency?: string;
  createdByUser: {
    id: string;
    username: string;
  };
  defaultArAccount: {
    id: string;
    accountName: string;
  };
  defaultApAccount: {
    id: string;
    accountName: string;
  };
  defaultCashAccount: {
    id: string;
    accountName: string;
  };
  defaultSalesAccount: {
    id: string;
    accountName: string;
  };
  defaultInventoryAccount: {
    id: string;
    accountName: string;
  };
  employees: {
    id: string;
    firstName: string;
    lastName: string;
  }[];
  partners: {
    id: string;
    name: string;
  }[];
  contacts: {
    id: string;
    contactName: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
