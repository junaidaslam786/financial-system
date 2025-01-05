export interface SalesOrderLine {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    taxRate: number;
    totalLineAmount: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface SalesOrder {
    id: string;
    companyId: string;
    customerId?: string;
    traderId?: string;
    orderNumber: string;
    orderDate: Date;
    status: string;
    totalAmount: number;
    brokerageId?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    lines: SalesOrderLine[];
  }
  