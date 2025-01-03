import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductionOrderStageEntity } from './entities/production-order-stage.entity';
import { CreateProductionOrderStageDto } from './dtos/create-production-order-stage.dto';
import { UpdateProductionOrderStageDto } from './dtos/update-production-order-stage.dto';

@Injectable()
export class ProductionOrderStagesService {
  constructor(
    @InjectRepository(ProductionOrderStageEntity)
    private readonly stageRepo: Repository<ProductionOrderStageEntity>,
  ) {}

  async create(dto: CreateProductionOrderStageDto): Promise<ProductionOrderStageEntity> {
    // Optional: check if there's already a stage with same (productionOrderId, processingStageId)
    // if you need to ensure uniqueness. Otherwise, just skip.

    const record = this.stageRepo.create({
      productionOrderId: dto.productionOrderId,
      processingStageId: dto.processingStageId,
      startTime: dto.startTime ? new Date(dto.startTime) : undefined,
      endTime: dto.endTime ? new Date(dto.endTime) : undefined,
      inputQuantity: dto.inputQuantity,
      outputQuantity: dto.outputQuantity,
      notes: dto.notes,
    });
    return this.stageRepo.save(record);
  }

  async findAllByProductionOrderId(productionOrderId: string): Promise<ProductionOrderStageEntity[]> {
    return this.stageRepo.find({
      where: { productionOrderId },
      order: { startTime: 'ASC' },
    });
  }

  async findOne(id: string): Promise<ProductionOrderStageEntity> {
    const record = await this.stageRepo.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Production order stage with ID "${id}" not found`);
    }
    return record;
  }

  async update(
    id: string,
    dto: UpdateProductionOrderStageDto,
  ): Promise<ProductionOrderStageEntity> {
    const record = await this.findOne(id);

    if (dto.productionOrderId !== undefined) {
      record.productionOrderId = dto.productionOrderId;
    }
    if (dto.processingStageId !== undefined) {
      record.processingStageId = dto.processingStageId;
    }
    if (dto.startTime !== undefined) {
      record.startTime = new Date(dto.startTime);
    }
    if (dto.endTime !== undefined) {
      record.endTime = new Date(dto.endTime);
    }
    if (dto.inputQuantity !== undefined) {
      record.inputQuantity = dto.inputQuantity;
    }
    if (dto.outputQuantity !== undefined) {
      record.outputQuantity = dto.outputQuantity;
    }
    if (dto.notes !== undefined) {
      record.notes = dto.notes;
    }

    return this.stageRepo.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.stageRepo.remove(record);
  }
}
