export class AccountResponseDto {
    id: string;
    accountName: string;
    accountType: string;
    parentAccountId?: string;
    currency?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  