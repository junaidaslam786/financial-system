import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryMovementEntity } from './entities/inventory-movement.entity';
import { CreateInventoryMovementDto } from './dtos/create-inventory-movement.dto';
import { UpdateInventoryMovementDto } from './dtos/update-inventory-movement.dto';

@Injectable()
export class InventoryMovementsService {
  constructor(
    @InjectRepository(InventoryMovementEntity)
    private readonly movementRepo: Repository<InventoryMovementEntity>,
  ) {}

  async create(dto: CreateInventoryMovementDto): Promise<InventoryMovementEntity> {
    // Optionally, confirm references exist (company, inventory).
    // Or rely on the DB constraints.

    const record = this.movementRepo.create({
      companyId: dto.companyId,
      inventoryId: dto.inventoryId,
      movementType: dto.movementType ?? 'IN',
      quantity: dto.quantity ?? 0,
      reason: dto.reason,
    });
    return this.movementRepo.save(record);
  }

  async findAllByCompanyId(companyId: string): Promise<InventoryMovementEntity[]> {
    return this.movementRepo.find({
      where: { companyId },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<InventoryMovementEntity> {
    const record = await this.movementRepo.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Inventory movement with ID "${id}" not found`);
    }
    return record;
  }

  async update(id: string, dto: UpdateInventoryMovementDto): Promise<InventoryMovementEntity> {
    const record = await this.findOne(id);

    if (dto.companyId !== undefined) {
      record.companyId = dto.companyId;
    }
    if (dto.inventoryId !== undefined) {
      record.inventoryId = dto.inventoryId;
    }
    if (dto.movementType !== undefined) {
      record.movementType = dto.movementType;
    }
    if (dto.quantity !== undefined) {
      record.quantity = dto.quantity;
    }
    if (dto.reason !== undefined) {
      record.reason = dto.reason;
    }

    return this.movementRepo.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.movementRepo.remove(record);
  }
}
