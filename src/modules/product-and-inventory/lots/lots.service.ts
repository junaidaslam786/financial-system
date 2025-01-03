import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LotEntity } from './entities/lot.entity';
import { CreateLotDto } from './dtos/create-lot.dto';
import { UpdateLotDto } from './dtos/update-lot.dto';

@Injectable()
export class LotsService {
  constructor(
    @InjectRepository(LotEntity)
    private readonly lotRepo: Repository<LotEntity>,
  ) {}

  async create(dto: CreateLotDto): Promise<LotEntity> {
    // Optional: check if lotNumber is unique
    const existingLotNumber = await this.lotRepo.findOne({
      where: { lotNumber: dto.lotNumber },
    });
    if (existingLotNumber) {
      throw new BadRequestException(`Lot number "${dto.lotNumber}" already exists`);
    }

    const lot = this.lotRepo.create({
      companyId: dto.companyId,
      lotNumber: dto.lotNumber,
      sourceSupplierId: dto.sourceSupplierId,
      initialQuantity: dto.initialQuantity,
      currentQuantity: dto.currentQuantity,
      status: dto.status ?? 'Pending',
    });
    return this.lotRepo.save(lot);
  }

  async findAll(companyId: string): Promise<LotEntity[]> {
    return this.lotRepo.find({
      where: { companyId },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<LotEntity> {
    const lot = await this.lotRepo.findOne({ where: { id } });
    if (!lot) {
      throw new NotFoundException(`Lot with ID "${id}" not found`);
    }
    return lot;
  }

  async update(id: string, dto: UpdateLotDto): Promise<LotEntity> {
    const lot = await this.findOne(id);

    if (dto.lotNumber !== undefined && dto.lotNumber !== lot.lotNumber) {
      // check if new lotNumber is unique
      const existingLot = await this.lotRepo.findOne({ where: { lotNumber: dto.lotNumber } });
      if (existingLot) {
        throw new BadRequestException(`Lot number "${dto.lotNumber}" already exists`);
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

    return this.lotRepo.save(lot);
  }

  async remove(id: string): Promise<void> {
    const lot = await this.findOne(id);
    // Possibly check if related data exists in lot_raw_materials or production_orders
    await this.lotRepo.remove(lot);
  }
}
