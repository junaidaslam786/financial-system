export interface IAuditTrail {
    id: string;
    userId?: string;
    action: string;
    entityName: string;
    entityId?: string;
    actionTimestamp: Date;
    ipAddress?: string;
    details?: any;
  }
  