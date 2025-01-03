import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyOwnerEntity } from './entities/company-owner.entity';
import {
  CreateCompanyOwnerDto,
  UpdateCompanyOwnerDto,
} from './dtos';
import { Company } from '../companies/entities/company.entity';

@Injectable()
export class CompanyOwnersService {
  constructor(
    @InjectRepository(CompanyOwnerEntity)
    private readonly ownersRepo: Repository<CompanyOwnerEntity>,
  ) {}

  async createOwner(dto: CreateCompanyOwnerDto) {
    const { companyId, ...rest } = dto;
    const owner = this.ownersRepo.create({
      ...rest,
      company: { id: companyId } as Company, // This ensures the FK is set
    });
    return this.ownersRepo.save(owner);
  }

  async findOneOwner(id: string) {
    const owner = await this.ownersRepo.findOne({ where: { id } });
    if (!owner) {
      throw new NotFoundException('Company owner not found');
    }
    return owner;
  }

  async updateOwner(id: string, dto: UpdateCompanyOwnerDto) {
    const owner = await this.findOneOwner(id);
    Object.assign(owner, dto);
    return this.ownersRepo.save(owner);
  }

  async removeOwner(id: string) {
    const owner = await this.findOneOwner(id);
    return this.ownersRepo.remove(owner);
  }
}
