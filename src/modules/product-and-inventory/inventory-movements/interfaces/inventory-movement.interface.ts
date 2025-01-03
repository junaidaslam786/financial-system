export interface IInventoryMovement {
    id?: string;
    companyId: string;
    inventoryId?: string;
    movementType?: 'IN'|'OUT'|'ADJUSTMENT';
    quantity?: number;
    reason?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  