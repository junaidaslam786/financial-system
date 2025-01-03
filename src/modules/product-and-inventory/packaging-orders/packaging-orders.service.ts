import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PackagingOrderEntity } from './entities/packaging-order.entity';
import { CreatePackagingOrderDto } from './dtos/create-packaging-order.dto';
import { UpdatePackagingOrderDto } from './dtos/update-packaging-order.dto';

@Injectable()
export class PackagingOrdersService {
  constructor(
    @InjectRepository(PackagingOrderEntity)
    private readonly pkgOrderRepo: Repository<PackagingOrderEntity>,
  ) {}

  async create(dto: CreatePackagingOrderDto): Promise<PackagingOrderEntity> {
    // If orderNumber must be unique, check it:
    if (dto.orderNumber) {
      const existingNum = await this.pkgOrderRepo.findOne({
        where: { orderNumber: dto.orderNumber },
      });
      if (existingNum) {
        throw new BadRequestException(`Order number "${dto.orderNumber}" already exists`);
      }
    }

    const record = this.pkgOrderRepo.create({
      companyId: dto.companyId,
      productionOrderId: dto.productionOrderId,
      orderNumber: dto.orderNumber,
      totalQuantity: dto.totalQuantity,
      bagWeight: dto.bagWeight,
      numberOfBags: dto.numberOfBags,
      status: dto.status ?? 'Pending',
    });
    return this.pkgOrderRepo.save(record);
  }

  async findAllByCompanyId(companyId: string): Promise<PackagingOrderEntity[]> {
    return this.pkgOrderRepo.find({
      where: { companyId },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<PackagingOrderEntity> {
    const record = await this.pkgOrderRepo.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Packaging Order with ID "${id}" not found`);
    }
    return record;
  }

  async update(id: string, dto: UpdatePackagingOrderDto): Promise<PackagingOrderEntity> {
    const record = await this.findOne(id);

    // If updating orderNumber, check uniqueness
    if (dto.orderNumber !== undefined && dto.orderNumber !== record.orderNumber) {
      const existingNum = await this.pkgOrderRepo.findOne({
        where: { orderNumber: dto.orderNumber },
      });
      if (existingNum) {
        throw new BadRequestException(`Order number "${dto.orderNumber}" already exists`);
      }
      record.orderNumber = dto.orderNumber;
    }

    if (dto.companyId !== undefined) {
      record.companyId = dto.companyId;
    }
    if (dto.productionOrderId !== undefined) {
      record.productionOrderId = dto.productionOrderId;
    }
    if (dto.totalQuantity !== undefined) {
      record.totalQuantity = dto.totalQuantity;
    }
    if (dto.bagWeight !== undefined) {
      record.bagWeight = dto.bagWeight;
    }
    if (dto.numberOfBags !== undefined) {
      record.numberOfBags = dto.numberOfBags;
    }
    if (dto.status !== undefined) {
      record.status = dto.status;
    }

    return this.pkgOrderRepo.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.pkgOrderRepo.remove(record);
  }
}
