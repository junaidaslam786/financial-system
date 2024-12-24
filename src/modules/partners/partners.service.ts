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
    const partner = this.partnerRepo.create(dto);
    return this.partnerRepo.save(partner);
  }

  async findOnePartner(id: string) {
    const partner = await this.partnerRepo.findOne({ where: { id } });
    if (!partner) {
      throw new NotFoundException('Partner not found');
    }
    return partner;
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
