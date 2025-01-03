import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryEntity } from './entities/inventory.entity';
import { CreateInventoryDto } from './dtos/create-inventory.dto';
import { UpdateInventoryDto } from './dtos/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryEntity)
    private readonly inventoryRepo: Repository<InventoryEntity>,
  ) {}

  async create(dto: CreateInventoryDto): Promise<InventoryEntity> {
    // If you want to confirm that warehouseId / productId are valid, you can do so.
    // Otherwise, rely on the foreign key constraints.

    const record = this.inventoryRepo.create({
      companyId: dto.companyId,
      warehouseId: dto.warehouseId,
      productId: dto.productId,
      quantity: dto.quantity ?? 0,
      batchNumber: dto.batchNumber,
      expirationDate: dto.expirationDate ? new Date(dto.expirationDate) : undefined,
    });
    return this.inventoryRepo.save(record);
  }

  async findAllByCompanyId(companyId: string): Promise<InventoryEntity[]> {
    return this.inventoryRepo.find({
      where: { companyId },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<InventoryEntity> {
    const record = await this.inventoryRepo.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Inventory record with ID "${id}" not found`);
    }
    return record;
  }

  async update(id: string, dto: UpdateInventoryDto): Promise<InventoryEntity> {
    const record = await this.findOne(id);

    if (dto.companyId !== undefined) {
      record.companyId = dto.companyId;
    }
    if (dto.warehouseId !== undefined) {
      record.warehouseId = dto.warehouseId;
    }
    if (dto.productId !== undefined) {
      record.productId = dto.productId;
    }
    if (dto.quantity !== undefined) {
      record.quantity = dto.quantity;
    }
    if (dto.batchNumber !== undefined) {
      record.batchNumber = dto.batchNumber;
    }
    if (dto.expirationDate !== undefined) {
      record.expirationDate = new Date(dto.expirationDate);
    }

    return this.inventoryRepo.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.inventoryRepo.remove(record);
  }
}
