import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LotRawMaterialEntity } from './entities/lot-raw-material.entity';
import { CreateLotRawMaterialDto } from './dtos/create-lot-raw-material.dto';
import { UpdateLotRawMaterialDto } from './dtos/update-lot-raw-material.dto';

@Injectable()
export class LotRawMaterialsService {
  constructor(
    @InjectRepository(LotRawMaterialEntity)
    private readonly rawMatRepo: Repository<LotRawMaterialEntity>,
  ) {}

  async create(dto: CreateLotRawMaterialDto): Promise<LotRawMaterialEntity> {
    // Optional: check if (lotId, productId) combo already exists to avoid duplicates
    const existing = await this.rawMatRepo.findOne({
      where: { lotId: dto.lotId, productId: dto.productId },
    });
    if (existing) {
      throw new BadRequestException(
        `This product "${dto.productId}" already exists for lot "${dto.lotId}"`,
      );
    }

    const record = this.rawMatRepo.create({
      lotId: dto.lotId,
      productId: dto.productId,
      quantity: dto.quantity,
    });
    return this.rawMatRepo.save(record);
  }

  async findAllByLotId(lotId: string): Promise<LotRawMaterialEntity[]> {
    return this.rawMatRepo.find({
      where: { lotId },
      order: { productId: 'ASC' },
    });
  }

  async findOne(id: string): Promise<LotRawMaterialEntity> {
    const record = await this.rawMatRepo.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Lot raw material with ID "${id}" not found`);
    }
    return record;
  }

  async update(
    id: string,
    dto: UpdateLotRawMaterialDto,
  ): Promise<LotRawMaterialEntity> {
    const record = await this.findOne(id);

    // If changing lotId or productId, check for duplicates
    if (dto.lotId !== undefined && dto.productId !== undefined) {
      // if both are provided, see if that combo exists
      const existing = await this.rawMatRepo.findOne({
        where: {
          lotId: dto.lotId,
          productId: dto.productId,
        },
      });
      if (existing && existing.id !== id) {
        throw new BadRequestException(
          `This product "${dto.productId}" already exists for lot "${dto.lotId}"`,
        );
      }
    }
    if (dto.lotId !== undefined) {
      record.lotId = dto.lotId;
    }
    if (dto.productId !== undefined) {
      record.productId = dto.productId;
    }
    if (dto.quantity !== undefined) {
      record.quantity = dto.quantity;
    }

    return this.rawMatRepo.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.rawMatRepo.remove(record);
  }
}
