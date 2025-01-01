// partners.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartnerEntity } from './entities/partner.entity';
import { CreatePartnerDto, UpdatePartnerDto } from './dtos';

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(PartnerEntity)
    private readonly partnerRepo: Repository<PartnerEntity>,
  ) {}

  async createPartner(dto: CreatePartnerDto) {
    const { companyId, ...rest } = dto;
    
    // Map companyId to company: { id: companyId }
    const partner = this.partnerRepo.create({
      ...rest,
      company: { id: companyId } as any, 
    });
  
    return this.partnerRepo.save(partner);
  }
  

  async findOnePartner(id: string) {
    const partner = await this.partnerRepo.findOne({ where: { id } });
    if (!partner) {
      throw new NotFoundException('Partner not found');
    }
    return partner;
  }

  async findAllPartnersOfCompany(companyId: string) {
    // (Optional) Verify that this company exists before retrieving partners.
    // e.g., you might do:
    // const company = await this.companyService.findOneCompany(companyId);
    // if (!company) {
    //   throw new NotFoundException(`Company with ID "${companyId}" not found`);
    // }
  
    return this.partnerRepo.find({
      where: { company: { id: companyId } },
      // If you need to load other relations, you can do:
      // relations: ['someRelation'],
    });
  }

  async updatePartner(id: string, dto: UpdatePartnerDto) {
    const partner = await this.findOnePartner(id);
    Object.assign(partner, dto);
    return this.partnerRepo.save(partner);
  }

  async removePartner(id: string) {
    const partner = await this.findOnePartner(id);
    return this.partnerRepo.remove(partner);
  }
}
