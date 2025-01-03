export interface IProductionOrder {
    id?: string;
    companyId: string;
    lotId: string;
    orderNumber: string;
    startDate?: Date;
    endDate?: Date;
    status?: 'Open' | 'In-Progress' | 'Completed' | 'Closed';
    createdAt?: Date;
    updatedAt?: Date;
  }
  