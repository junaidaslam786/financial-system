export interface IWorkflow {
    id: string;
    companyId: string;
    documentType?: string;
    stateName: string;
    isInitial: boolean;
    isFinal: boolean;
  }
  