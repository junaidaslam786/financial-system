export interface InvoiceItem {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    taxRate: number;
    totalPrice: number;
    description?: string;
  }
  
  export interface Invoice {
    id: string;
    companyId: string;
    customerId?: string;
    brokerId?: string;
    invoiceNumber: string;
    invoiceDate: Date;
    dueDate?: Date;
    totalAmount: number;
    currency?: string;
    status: string;
    termsAndConditions?: string;
    notes?: string;
    items: InvoiceItem[];
  }
  