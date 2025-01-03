import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessingStageEntity } from './entities/processing-stage.entity';
import { CreateProcessingStageDto } from './dtos/create-processing-stage.dto';
import { UpdateProcessingStageDto } from './dtos/update-processing-stage.dto';

@Injectable()
export class ProcessingStagesService {
  constructor(
    @InjectRepository(ProcessingStageEntity)
    private readonly stageRepo: Repository<ProcessingStageEntity>,
  ) {}

  async create(dto: CreateProcessingStageDto): Promise<ProcessingStageEntity> {
    // Optionally check if stageName is unique within the same company
    // If you want that constraint, do it here:

    const stage = this.stageRepo.create({
      companyId: dto.companyId,
      stageName: dto.stageName,
      description: dto.description,
    });
    return this.stageRepo.save(stage);
  }

  async findAllByCompanyId(companyId: string): Promise<ProcessingStageEntity[]> {
    return this.stageRepo.find({
      where: { companyId },
      order: { stageName: 'ASC' },
    });
  }

  async findOne(id: string): Promise<ProcessingStageEntity> {
    const stage = await this.stageRepo.findOne({ where: { id } });
    if (!stage) {
      throw new NotFoundException(`Processing Stage with ID "${id}" not found`);
    }
    return stage;
  }

  async update(id: string, dto: UpdateProcessingStageDto): Promise<ProcessingStageEntity> {
    const stage = await this.findOne(id);

    if (dto.companyId !== undefined) {
      stage.companyId = dto.companyId;
    }
    if (dto.stageName !== undefined) {
      stage.stageName = dto.stageName;
    }
    if (dto.description !== undefined) {
      stage.description = dto.description;
    }

    return this.stageRepo.save(stage);
  }

  async remove(id: string): Promise<void> {
    const stage = await this.findOne(id);

    // If production_order_stages references this stage, check if it’s safe to remove
    // Or rely on ON DELETE CASCADE logic if no references exist

    await this.stageRepo.remove(stage);
  }
}
