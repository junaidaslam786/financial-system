export interface IPurchaseOrder {
    id: string;
    companyId: string;
    supplierId?: string;
    brokerId?: string;
    orderNumber: string;
    orderDate: Date;
    expectedDeliveryDate?: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }
  