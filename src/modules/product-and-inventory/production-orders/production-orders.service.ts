import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductionOrderEntity } from './entities/production-order.entity';
import { CreateProductionOrderDto } from './dtos/create-production-order.dto';
import { UpdateProductionOrderDto } from './dtos/update-production-order.dto';

@Injectable()
export class ProductionOrdersService {
  constructor(
    @InjectRepository(ProductionOrderEntity)
    private readonly orderRepo: Repository<ProductionOrderEntity>,
  ) {}

  async create(dto: CreateProductionOrderDto): Promise<ProductionOrderEntity> {
    // Check if orderNumber is unique
    const existingNumber = await this.orderRepo.findOne({
      where: { orderNumber: dto.orderNumber },
    });
    if (existingNumber) {
      throw new BadRequestException(`Order number "${dto.orderNumber}" already exists`);
    }

    const productionOrder = this.orderRepo.create({
      companyId: dto.companyId,
      lotId: dto.lotId,
      orderNumber: dto.orderNumber,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      status: dto.status ?? 'Open',
    });
    return this.orderRepo.save(productionOrder);
  }

  async findAllByCompanyId(companyId: string): Promise<ProductionOrderEntity[]> {
    return this.orderRepo.find({
      where: { companyId },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<ProductionOrderEntity> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Production Order with ID "${id}" not found`);
    }
    return order;
  }

  async update(id: string, dto: UpdateProductionOrderDto): Promise<ProductionOrderEntity> {
    const order = await this.findOne(id);

    if (dto.orderNumber !== undefined && dto.orderNumber !== order.orderNumber) {
      // check uniqueness
      const existingNum = await this.orderRepo.findOne({
        where: { orderNumber: dto.orderNumber },
      });
      if (existingNum) {
        throw new BadRequestException(`Order number "${dto.orderNumber}" already exists`);
      }
      order.orderNumber = dto.orderNumber;
    }

    if (dto.companyId !== undefined) {
      order.companyId = dto.companyId;
    }
    if (dto.lotId !== undefined) {
      order.lotId = dto.lotId;
    }
    if (dto.startDate !== undefined) {
      order.startDate = new Date(dto.startDate);
    }
    if (dto.endDate !== undefined) {
      order.endDate = new Date(dto.endDate);
    }
    if (dto.status !== undefined) {
      order.status = dto.status;
    }

    return this.orderRepo.save(order);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);

    // Possibly check if references in production_order_stages exist
    // or rely on ON DELETE CASCADE if you're okay removing them

    await this.orderRepo.remove(order);
  }
}
