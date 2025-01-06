import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderLine } from './entities/purchase-order-line.entity';
import { CreatePurchaseOrderDto } from './dtos/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dtos/update-purchase-order.dto';
import { CreatePurchaseOrderLineDto } from './dtos/create-purchase-order-line.dto';
import { UpdatePurchaseOrderLineDto } from './dtos/update-purchase-order-line.dto';
import { Company } from '../../companies/entities/company.entity';
import { SupplierEntity } from 'src/modules/company-contacts/suppliers/entities/supplier.entity';
import { BrokerEntity } from 'src/modules/company-contacts/brokers/entities/broker.entity';
import { ProductEntity } from 'src/modules/product-and-inventory/products/entities/product.entity';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepo: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderLine)
    private readonly purchaseOrderLineRepo: Repository<PurchaseOrderLine>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    @InjectRepository(SupplierEntity)
    private readonly supplierRepo: Repository<SupplierEntity>,
    @InjectRepository(BrokerEntity)
    private readonly brokerRepo: Repository<BrokerEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  // ----------------------------
  // Purchase Orders
  // ----------------------------

  async createPurchaseOrder(dto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    // Validate company
    const company = await this.companyRepo.findOne({ where: { id: dto.companyId } });
    if (!company) {
      throw new BadRequestException('Invalid companyId.');
    }

    // Validate optional supplier
    let supplier: SupplierEntity | undefined;
    if (dto.supplierId) {
      supplier = await this.supplierRepo.findOne({ where: { id: dto.supplierId } });
      if (!supplier) {
        throw new BadRequestException('Invalid supplierId.');
      }
    }

    // Validate optional broker
    let broker: BrokerEntity | undefined;
    if (dto.brokerId) {
      broker = await this.brokerRepo.findOne({ where: { id: dto.brokerId } });
      if (!broker) {
        throw new BadRequestException('Invalid brokerId.');
      }
    }

    const purchaseOrder = this.purchaseOrderRepo.create({
      company,
      supplier,
      broker,
      orderNumber: dto.orderNumber,
      orderDate: dto.orderDate ? new Date(dto.orderDate) : undefined,
      expectedDeliveryDate: dto.expectedDeliveryDate
        ? new Date(dto.expectedDeliveryDate)
        : undefined,
      status: dto.status || 'Open',
    });

    // If lines were provided at creation
    if (dto.lines?.length) {
      purchaseOrder.lines = await Promise.all(
        dto.lines.map(async (lineDto) => {
          const lineEntity = await this.buildPurchaseOrderLine(lineDto);
          lineEntity.purchaseOrder = purchaseOrder;
          return lineEntity;
        }),
      );
    } else {
      purchaseOrder.lines = [];
    }

    return this.purchaseOrderRepo.save(purchaseOrder);
  }

  async findAllPurchaseOrders(): Promise<PurchaseOrder[]> {
    return this.purchaseOrderRepo.find({
      relations: ['company', 'supplier', 'broker', 'lines', 'lines.product'],
    });
  }

  async findOnePurchaseOrder(id: string): Promise<PurchaseOrder> {
    const po = await this.purchaseOrderRepo.findOne({
      where: { id },
      relations: ['company', 'supplier', 'broker', 'lines', 'lines.product'],
    });
    if (!po) {
      throw new NotFoundException(`PurchaseOrder with id "${id}" not found.`);
    }
    return po;
  }

  async updatePurchaseOrder(id: string, dto: UpdatePurchaseOrderDto): Promise<PurchaseOrder> {
    const po = await this.findOnePurchaseOrder(id);

    if (dto.companyId) {
      const company = await this.companyRepo.findOne({ where: { id: dto.companyId } });
      if (!company) {
        throw new BadRequestException('Invalid companyId.');
      }
      po.company = company;
    }

    if (dto.supplierId) {
      const supplier = await this.supplierRepo.findOne({ where: { id: dto.supplierId } });
      if (!supplier) {
        throw new BadRequestException('Invalid supplierId.');
      }
      po.supplier = supplier;
    } else if (dto.supplierId === null) {
      po.supplier = undefined;
    }

    if (dto.brokerId) {
      const broker = await this.brokerRepo.findOne({ where: { id: dto.brokerId } });
      if (!broker) {
        throw new BadRequestException('Invalid brokerId.');
      }
      po.broker = broker;
    } else if (dto.brokerId === null) {
      po.broker = undefined;
    }

    if (dto.orderNumber !== undefined) po.orderNumber = dto.orderNumber;
    if (dto.orderDate) po.orderDate = new Date(dto.orderDate);
    if (dto.expectedDeliveryDate) {
      po.expectedDeliveryDate = new Date(dto.expectedDeliveryDate);
    }

    if (dto.status) {
      po.status = dto.status;
    }

    // If we want to handle lines in update as well...
    if (dto.lines) {
      // Remove old lines and replace, or merge logic, depending on business rules
      await this.purchaseOrderLineRepo.remove(po.lines); 
      po.lines = await Promise.all(
        dto.lines.map(async (lineDto) => {
          const newLineEntity = await this.buildPurchaseOrderLine(lineDto);
          newLineEntity.purchaseOrder = po;
          return newLineEntity;
        }),
      );
    }

    return this.purchaseOrderRepo.save(po);
  }

  async removePurchaseOrder(id: string): Promise<void> {
    const po = await this.findOnePurchaseOrder(id);
    await this.purchaseOrderRepo.remove(po);
  }

  // ----------------------------
  // Purchase Order Lines (Sub-resource)
  // ----------------------------

  // Utility for creating line entities
  private async buildPurchaseOrderLine(
    lineDto: CreatePurchaseOrderLineDto,
  ): Promise<PurchaseOrderLine> {
    let product: ProductEntity | undefined;
    if (lineDto.productId) {
      product = await this.productRepo.findOne({ where: { id: lineDto.productId } });
      if (!product) {
        throw new BadRequestException('Invalid productId.');
      }
    }

    return this.purchaseOrderLineRepo.create({
      product,
      quantity: lineDto.quantity,
      unitPrice: lineDto.unitPrice,
      discount: lineDto.discount || 0,
      taxRate: lineDto.taxRate || 0,
    });
  }

  // If you want explicit sub-resource methods for lines:
  async createLine(purchaseOrderId: string, dto: CreatePurchaseOrderLineDto): Promise<PurchaseOrderLine> {
    const po = await this.findOnePurchaseOrder(purchaseOrderId);
    const lineEntity = await this.buildPurchaseOrderLine(dto);
    lineEntity.purchaseOrder = po;
    return this.purchaseOrderLineRepo.save(lineEntity);
  }

  async updateLine(id: string, dto: UpdatePurchaseOrderLineDto): Promise<PurchaseOrderLine> {
    const line = await this.purchaseOrderLineRepo.findOne({
      where: { id },
      relations: ['purchaseOrder', 'product'],
    });
    if (!line) {
      throw new NotFoundException(`PurchaseOrderLine with id "${id}" not found.`);
    }

    if (dto.productId) {
      const product = await this.productRepo.findOne({ where: { id: dto.productId } });
      if (!product) {
        throw new BadRequestException('Invalid productId.');
      }
      line.product = product;
    } else if (dto.productId === null) {
      line.product = undefined;
    }

    if (dto.quantity !== undefined) line.quantity = dto.quantity;
    if (dto.unitPrice !== undefined) line.unitPrice = dto.unitPrice;
    if (dto.discount !== undefined) line.discount = dto.discount;
    if (dto.taxRate !== undefined) line.taxRate = dto.taxRate;

    return this.purchaseOrderLineRepo.save(line);
  }

  async removeLine(id: string): Promise<void> {
    const line = await this.purchaseOrderLineRepo.findOne({ where: { id } });
    if (!line) {
      throw new NotFoundException(`PurchaseOrderLine with id "${id}" not found.`);
    }
    await this.purchaseOrderLineRepo.remove(line);
  }
}
