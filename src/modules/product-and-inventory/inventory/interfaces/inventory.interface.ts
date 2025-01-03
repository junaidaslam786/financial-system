export interface IInventory {
    id?: string;
    companyId: string;
    warehouseId?: string;
    productId?: string;
    quantity?: number;
    batchNumber?: string;
    expirationDate?: string | Date;
    createdAt?: Date;
    updatedAt?: Date;
  }
  