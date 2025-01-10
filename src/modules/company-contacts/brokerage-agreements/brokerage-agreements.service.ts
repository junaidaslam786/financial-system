import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrokerageAgreementEntity } from './entities/brokerage-agreement.entity';
import { CreateBrokerageAgreementDto } from './dtos/create-brokerage-agreement.dto';
import { UpdateBrokerageAgreementDto } from './dtos/update-brokerage-agreement.dto';

@Injectable()
export class BrokerageAgreementsService {
  constructor(
    @InjectRepository(BrokerageAgreementEntity)
    private readonly agreementRepo: Repository<BrokerageAgreementEntity>,
  ) {}

  async create(dto: CreateBrokerageAgreementDto): Promise<BrokerageAgreementEntity> {
    const agreement = this.agreementRepo.create({
      broker: { id: dto.brokerId },
      agreementName: dto.agreementName,
      brokerageRate: dto.brokerageRate,
      validFrom: dto.validFrom ? new Date(dto.validFrom) : undefined,
      validTo: dto.validTo ? new Date(dto.validTo) : undefined,
    });
    return this.agreementRepo.save(agreement);
  }

  async findAll(companyId: string): Promise<BrokerageAgreementEntity[]> {
    return this.agreementRepo.find({
      where: {
        broker: { company: { id: companyId } },
      },
      relations: ['broker', 'broker.company'],
    });
  }

  async findOne(id: string): Promise<BrokerageAgreementEntity> {
    const agreement = await this.agreementRepo.findOne({ where: { id } });
    if (!agreement) {
      throw new NotFoundException(`BrokerageAgreement with ID "${id}" not found`);
    }
    return agreement;
  }

  async update(id: string, dto: UpdateBrokerageAgreementDto): Promise<BrokerageAgreementEntity> {
    const agreement = await this.findOne(id);

    if (dto.brokerId !== undefined) {
      agreement.broker = { id: dto.brokerId } as any;
    }
    if (dto.agreementName !== undefined) {
      agreement.agreementName = dto.agreementName;
    }
    if (dto.brokerageRate !== undefined) {
      agreement.brokerageRate = dto.brokerageRate;
    }
    if (dto.validFrom !== undefined) {
      agreement.validFrom = dto.validFrom ? new Date(dto.validFrom) : undefined;
    }
    if (dto.validTo !== undefined) {
      agreement.validTo = dto.validTo ? new Date(dto.validTo) : undefined;
    }

    return this.agreementRepo.save(agreement);
  }

  async remove(id: string): Promise<void> {
    const agreement = await this.findOne(id);
    await this.agreementRepo.remove(agreement);
  }
}
