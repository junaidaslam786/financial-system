import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseEntity } from './entities/warehouse.entity';
import { CreateWarehouseDto } from './dtos/create-warehouse.dto';
import { UpdateWarehouseDto } from './dtos/update-warehouse.dto';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(WarehouseEntity)
    private readonly warehouseRepo: Repository<WarehouseEntity>,
  ) {}

  async create(dto: CreateWarehouseDto): Promise<WarehouseEntity> {
    // Optionally, check if the companyId is valid (e.g. check companies table).
    // For brevity, rely on FK constraints.

    const warehouse = this.warehouseRepo.create({
      companyId: dto.companyId,
      location: dto.location,
      capacity: dto.capacity ?? 0,
    });
    return this.warehouseRepo.save(warehouse);
  }

  async findAllByCompanyId(companyId: string): Promise<WarehouseEntity[]> {
    return this.warehouseRepo.find({
      where: { companyId },
      order: { location: 'ASC' },
    });
  }

  async findOne(id: string): Promise<WarehouseEntity> {
    const warehouse = await this.warehouseRepo.findOne({ where: { id } });
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID "${id}" not found`);
    }
    return warehouse;
  }

  async update(id: string, dto: UpdateWarehouseDto): Promise<WarehouseEntity> {
    const warehouse = await this.findOne(id);

    if (dto.companyId !== undefined) {
      // optional check if new companyId is valid
      warehouse.companyId = dto.companyId;
    }
    if (dto.location !== undefined) {
      warehouse.location = dto.location;
    }
    if (dto.capacity !== undefined) {
      warehouse.capacity = dto.capacity;
    }

    return this.warehouseRepo.save(warehouse);
  }

  async remove(id: string): Promise<void> {
    const warehouse = await this.findOne(id);

    // If you have references to this warehouse in inventory, etc., 
    // decide if you want to allow deletion or do a check.

    await this.warehouseRepo.remove(warehouse);
  }
}
