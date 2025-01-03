export interface IPackagingOrder {
    id?: string;
    companyId: string;
    productionOrderId?: string;
    orderNumber?: string;
    totalQuantity?: number;
    bagWeight?: number;
    numberOfBags?: number;
    status?: 'Pending' | 'In-Progress' | 'Completed';
    createdAt?: Date;
    updatedAt?: Date;
  }
  