export interface IProductionOrderStage {
    id?: string;
    productionOrderId: string;
    processingStageId: string;
    startTime?: Date;
    endTime?: Date;
    inputQuantity?: number;
    outputQuantity?: number;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  