// uom.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnitOfMeasureEntity } from './entities/unit-of-measure.entity';
import { CreateUomDto, UpdateUomDto } from './dtos';
import { Company } from '../companies/entities/company.entity';

@Injectable()
export class UomService {
  constructor(
    @InjectRepository(UnitOfMeasureEntity)
    private readonly uomRepo: Repository<UnitOfMeasureEntity>,

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  async createUom(dto: CreateUomDto) {
    // Ensure companyId is valid (optional but recommended)
    const companyExists = await this.companyRepo.findOne({ where: { id: dto.companyId } });
    if (!companyExists) {
      throw new NotFoundException(`Company with ID "${dto.companyId}" not found.`);
    }
  
    const uom = this.uomRepo.create(dto);
    return this.uomRepo.save(uom);
  }
  

  async findAllUom() {
    return this.uomRepo.find();
  }

  async updateUom(id: string, dto: UpdateUomDto) {
    const uom = await this.uomRepo.findOne({ where: { id } });
    if (!uom) {
      throw new NotFoundException('Unit of Measure not found');
    }
    Object.assign(uom, dto);
    return this.uomRepo.save(uom);
  }

  async removeUom(id: string) {
    const uom = await this.uomRepo.findOne({ where: { id } });
    if (!uom) {
      throw new NotFoundException('Unit of Measure not found');
    }
    return this.uomRepo.remove(uom);
  }
}
