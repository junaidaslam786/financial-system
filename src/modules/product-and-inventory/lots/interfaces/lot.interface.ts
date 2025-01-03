export interface ILot {
    id?: string;
    companyId: string;
    lotNumber: string;
    sourceSupplierId?: string;
    initialQuantity: number;
    currentQuantity: number;
    status: 'Pending' | 'In-Process' | 'Completed';
    createdAt?: Date;
    updatedAt?: Date;
  }
  