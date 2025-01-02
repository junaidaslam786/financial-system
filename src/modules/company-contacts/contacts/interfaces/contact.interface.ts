export interface IContact {
    id?: string;
    entityType: 'Customer' | 'Supplier' | 'Trader' | 'Broker' | 'Partner';
    entityId: string;
    contactName?: string;
    phone?: string;
    email?: string;
    address?: string;
    isPrimary?: boolean;
  }
  