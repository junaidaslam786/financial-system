// lots.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { LotEntity } from './entities/lot.entity';
import { CreateLotDto } from './dtos/create-lot.dto';
import { UpdateLotDto } from './dtos/update-lot.dto';

// Import the line entities so we can update them
import { PurchaseOrderLine } from 'src/modules/company-purchases/purchase-orders/entities/purchase-order-line.entity';
import { SalesOrderLine } from 'src/modules/sales-and-invoicing/sales-orders/entities/sales-order-line.entity';
import { InvoiceItem } from 'src/modules/sales-and-invoicing/invoices/entities/invoice-item.entity';
import { ProductionOrderEntity } from '../production-orders/entities/production-order.entity';
import { PurchaseOrder } from 'src/modules/company-purchases/purchase-orders/entities/purchase-order.entity';
import { SalesOrderEntity } from 'src/modules/sales-and-invoicing/sales-orders/entities/sales-order.entity';
import { Invoice } from 'src/modules/sales-and-invoicing/invoices/entities/invoice.entity';

@Injectable()
export class LotsService {
  constructor(
    @InjectRepository(LotEntity)
    private readonly lotRepo: Repository<LotEntity>,

    @InjectRepository(PurchaseOrderLine)
    private readonly poLineRepo: Repository<PurchaseOrderLine>,

    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepo: Repository<PurchaseOrder>,

    @InjectRepository(SalesOrderEntity)
    private readonly salesOrderRepo: Repository<SalesOrderEntity>,

    @InjectRepository(SalesOrderLine)
    private readonly soLineRepo: Repository<SalesOrderLine>,

    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,

    @InjectRepository(InvoiceItem)
    private readonly invoiceItemRepo: Repository<InvoiceItem>,

    @InjectRepository(ProductionOrderEntity)
    private readonly productionOrderRepo: Repository<ProductionOrderEntity>,
  ) {}

  async create(dto: CreateLotDto): Promise<LotEntity> {
    // Check if lotNumber is unique
    const existingLotNumber = await this.lotRepo.findOne({
      where: { lotNumber: dto.lotNumber },
    });
    if (existingLotNumber) {
      throw new BadRequestException(
        `Lot number "${dto.lotNumber}" already exists`,
      );
    }

    const lot = this.lotRepo.create({
      companyId: dto.companyId,
      lotNumber: dto.lotNumber,
      sourceSupplierId: dto.sourceSupplierId,
      initialQuantity: dto.initialQuantity,
      currentQuantity: dto.currentQuantity,
      status: dto.status ?? 'Pending',
      productId: dto.productId,
    });
    return this.lotRepo.save(lot);
  }

  async findAll(companyId: string): Promise<LotEntity[]> {
    return this.lotRepo.find({
      where: { companyId },
      order: { createdAt: 'ASC' },
      relations: [
        'sourceSupplier',
        'company',
        'purchaseOrderLines',
        'purchaseOrderLines.purchaseOrder',
        'salesOrderLines',
        'salesOrderLines.salesOrder.customer',
        'salesOrderLines.salesOrder.trader',
        'invoiceItems',
        'invoiceItems.invoice', // if you want the entire Invoice
        'productionOrders', //
        'product',

      ],
    });
  }

  async findOne(lotId: string): Promise<LotEntity> {
    const lot = await this.lotRepo.findOne({
      where: { id: lotId },
      relations: [
        'sourceSupplier',
        'company',
        'purchaseOrderLines',
        'purchaseOrderLines.purchaseOrder',
        'purchaseOrderLines.purchaseOrder.supplier',
        'purchaseOrderLines.purchaseOrder.broker',
        'salesOrderLines',
        'salesOrderLines.salesOrder',
        'salesOrderLines.salesOrder.customer',
        'salesOrderLines.salesOrder.trader',
        'invoiceItems',
        'invoiceItems.invoice', // if you want the entire Invoice
        'productionOrders', // if you want the entire production order(s)
        'product'
      ],
      // order: {
      //   // optional: specify sorting for lines, e.g.
      //   purchaseOrderLines: { createdAt: 'ASC' },
      //   salesOrderLines: { createdAt: 'ASC' },
      // },
    });
    if (!lot) {
      throw new NotFoundException(`Lot with ID "${lotId}" not found`);
    }
    return lot;
  }

  async update(id: string, dto: UpdateLotDto): Promise<LotEntity> {
    const lot = await this.findOne(id);

    if (dto.lotNumber && dto.lotNumber !== lot.lotNumber) {
      // check if new lotNumber is unique
      const existingLot = await this.lotRepo.findOne({
        where: { lotNumber: dto.lotNumber },
      });
      if (existingLot) {
        throw new BadRequestException(
          `Lot number "${dto.lotNumber}" already exists`,
        );
      }
      lot.lotNumber = dto.lotNumber;
    }

    if (dto.companyId !== undefined) {
      lot.companyId = dto.companyId;
    }
    if (dto.sourceSupplierId !== undefined) {
      lot.sourceSupplierId = dto.sourceSupplierId;
    }
    if (dto.initialQuantity !== undefined) {
      lot.initialQuantity = dto.initialQuantity;
    }
    if (dto.currentQuantity !== undefined) {
      lot.currentQuantity = dto.currentQuantity;
    }
    if (dto.status !== undefined) {
      lot.status = dto.status;
    }
    if (dto.productId !== undefined) {
      lot.productId = dto.productId;
    }

    return this.lotRepo.save(lot);
  }

  async remove(id: string): Promise<void> {
    const lot = await this.findOne(id);
    await this.lotRepo.remove(lot);
  }

  /**
   * Link a purchase order to a lot by:
   *  1) verifying the lot
   *  2) verifying the purchase order
   *  3) if lineIds is provided, update only those lines
   *     otherwise, update ALL lines belonging to that purchase order
   */
  async linkPurchaseOrderToLot(
    lotId: string,
    purchaseOrderId: string,
    lineIds?: string[],
  ): Promise<void> {
    // 1) verify lot exists
    const lot = await this.findOne(lotId);

    // 2) find the purchase order (header) by ID
    const purchaseOrder = await this.purchaseOrderRepo.findOne({
      where: { id: purchaseOrderId },
      relations: ['lines'],
    });
    if (!purchaseOrder) {
      throw new NotFoundException(
        `Purchase order not found: ${purchaseOrderId}`,
      );
    }

    // 3) if lineIds is not provided, we link ALL lines
    let linesToLink = purchaseOrder.lines;
    if (lineIds && lineIds.length > 0) {
      // link only the specified lines
      linesToLink = purchaseOrder.lines.filter((line) =>
        lineIds.includes(line.id),
      );
    }

    if (!linesToLink || linesToLink.length === 0) {
      throw new BadRequestException(`No lines found to link with lot ${lotId}`);
    }

    // 4) update each line with lotId
    const lineIdsToUpdate = linesToLink.map((l) => l.id);
    await this.poLineRepo.update(
      { id: In(lineIdsToUpdate) },
      { lotId: lot.id },
    );
  }

  async linkSalesOrderToLot(
    lotId: string,
    salesOrderId: string,
    lineIds?: string[],
  ): Promise<void> {
    const lot = await this.findOne(lotId);

    const salesOrder = await this.salesOrderRepo.findOne({
      where: { id: salesOrderId },
      relations: ['lines'],
    });
    if (!salesOrder) {
      throw new NotFoundException(`Sales order not found: ${salesOrderId}`);
    }

    let linesToLink = salesOrder.lines;
    if (lineIds && lineIds.length > 0) {
      linesToLink = salesOrder.lines.filter((line) =>
        lineIds.includes(line.id),
      );
    }

    if (linesToLink.length === 0) {
      throw new BadRequestException(`No lines found to link with lot ${lotId}`);
    }

    const lineIdsToUpdate = linesToLink.map((l) => l.id);
    await this.soLineRepo.update(
      { id: In(lineIdsToUpdate) },
      { lotId: lot.id },
    );
  }

  async linkInvoiceToLot(
    lotId: string,
    invoiceId: string,
    itemIds?: string[],
  ): Promise<void> {
    const lot = await this.findOne(lotId);

    const invoice = await this.invoiceRepo.findOne({
      where: { id: invoiceId },
      relations: ['items'],
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice not found: ${invoiceId}`);
    }

    let itemsToLink = invoice.items;
    if (itemIds && itemIds.length > 0) {
      itemsToLink = invoice.items.filter((item) => itemIds.includes(item.id));
    }

    if (itemsToLink.length === 0) {
      throw new BadRequestException(`No items found to link with lot ${lotId}`);
    }

    const itemIdsToUpdate = itemsToLink.map((i) => i.id);
    await this.invoiceItemRepo.update(
      { id: In(itemIdsToUpdate) },
      { lotId: lot.id },
    );
  }

  async linkProductionOrderToLot(
    productionOrderId: string,
    lotId: string,
  ): Promise<ProductionOrderEntity> {
    // 1) fetch the production order
    const prodOrder = await this.productionOrderRepo.findOne({
      where: { id: productionOrderId },
    });
    if (!prodOrder) {
      throw new NotFoundException(
        `Production order not found: ${productionOrderId}`,
      );
    }

    // 2) fetch the lot
    const lot = await this.lotRepo.findOne({ where: { id: lotId } });
    if (!lot) {
      throw new NotFoundException(`Lot not found: ${lotId}`);
    }

    // 3) link them
    prodOrder.lotId = lotId;
    return this.productionOrderRepo.save(prodOrder);
  }

  /**
   * Example: Summarize total purchased vs total sold for a lot
   */
  async getLotSummary(lotId: string) {
    const lot = await this.findOne(lotId);
    // sum purchase lines
    const purchaseSum = await this.poLineRepo
      .createQueryBuilder('pol')
      .select('SUM(pol.quantity)', 'totalPurchased')
      .where('pol.lot_id = :lotId', { lotId })
      .getRawOne();

    // sum invoice items
    const salesSum = await this.invoiceItemRepo
      .createQueryBuilder('inv')
      .select('SUM(inv.quantity)', 'totalSold')
      .where('inv.lot_id = :lotId', { lotId })
      .getRawOne();

    const totalPurchased = Number(purchaseSum?.totalPurchased) || 0;
    const totalSold = Number(salesSum?.totalSold) || 0;

    return {
      lot,
      totalPurchased,
      totalSold,
      leftover: totalPurchased - totalSold,
    };
  }
}
