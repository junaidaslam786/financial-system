export interface IExchangeRate {
    id?: string;
    baseCurrency: string;
    targetCurrency: string;
    rate: number;
    effectiveDate: Date;
  }
  