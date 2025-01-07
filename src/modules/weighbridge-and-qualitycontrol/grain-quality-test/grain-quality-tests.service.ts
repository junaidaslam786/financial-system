import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GrainQualityTest } from './entities/grain-quality-test.entity';
import { CreateGrainQualityTestDto } from './dtos/create-grain-quality-test.dto';
import { UpdateGrainQualityTestDto } from './dtos/update-grain-quality-test.dto';
import { LotEntity } from 'src/modules/product-and-inventory/lots/entities/lot.entity';

@Injectable()
export class GrainQualityTestsService {
  constructor(
    @InjectRepository(GrainQualityTest)
    private readonly gqtRepo: Repository<GrainQualityTest>,
    @InjectRepository(LotEntity)
    private readonly lotRepo: Repository<LotEntity>,
  ) {}

  async create(dto: CreateGrainQualityTestDto): Promise<GrainQualityTest> {
    // Optional lot
    let lot: LotEntity | undefined;
    if (dto.lotId) {
      lot = await this.lotRepo.findOne({ where: { id: dto.lotId } });
      if (!lot) {
        throw new BadRequestException('Invalid lotId.');
      }
    }

    const gqt = this.gqtRepo.create({
      lot,
      moistureContent: dto.moistureContent,
      brokenGrainsPercentage: dto.brokenGrainsPercentage,
      foreignMatterPercentage: dto.foreignMatterPercentage,
      notes: dto.notes,
    });

    return this.gqtRepo.save(gqt);
  }

  async findAll(): Promise<GrainQualityTest[]> {
    return this.gqtRepo.find({
      relations: ['lot'],
    });
  }

  async findOne(id: string): Promise<GrainQualityTest> {
    const gqt = await this.gqtRepo.findOne({
      where: { id },
      relations: ['lot'],
    });
    if (!gqt) {
      throw new NotFoundException(`GrainQualityTest with id "${id}" not found.`);
    }
    return gqt;
  }

  async update(id: string, dto: UpdateGrainQualityTestDto): Promise<GrainQualityTest> {
    const gqt = await this.findOne(id);

    if (dto.lotId) {
      const lot = await this.lotRepo.findOne({ where: { id: dto.lotId } });
      if (!lot) {
        throw new BadRequestException('Invalid lotId.');
      }
      gqt.lot = lot;
    } else if (dto.lotId === null) {
      gqt.lot = undefined;
    }

    if (dto.moistureContent !== undefined) gqt.moistureContent = dto.moistureContent;
    if (dto.brokenGrainsPercentage !== undefined) {
      gqt.brokenGrainsPercentage = dto.brokenGrainsPercentage;
    }
    if (dto.foreignMatterPercentage !== undefined) {
      gqt.foreignMatterPercentage = dto.foreignMatterPercentage;
    }
    if (dto.notes !== undefined) gqt.notes = dto.notes;

    return this.gqtRepo.save(gqt);
  }

  async remove(id: string): Promise<void> {
    const gqt = await this.findOne(id);
    await this.gqtRepo.remove(gqt);
  }
}
