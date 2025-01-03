export interface IProduct {
    id?: string;
    companyId: string;
    categoryId?: string;
    productName: string;
    sku?: string;
    productType?: 'RawMaterial'|'FinishedGood'|'Service';
    unitOfMeasureId?: string;
    costPrice?: number;
    sellingPrice?: number;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }
  