export interface IWeighbridgeTicket {
    id: string;
    companyId: string;
    ticketNumber: string;
    vehicleNumber?: string;
    inboundWeight: number;
    outboundWeight: number;
    netWeight: number;
    materialType?: string;
    lotId?: string;
    date: Date;
    createdAt: Date;
  }
  