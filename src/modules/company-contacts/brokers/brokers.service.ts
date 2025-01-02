import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrokerEntity } from './entities/broker.entity';
import { CreateBrokerDto } from './dtos/create-broker.dto';
import { UpdateBrokerDto } from './dtos/update-broker.dto';
import { Account } from 'src/modules/financial/accounts/entities/account.entity';

@Injectable()
export class BrokersService {
  constructor(
    @InjectRepository(BrokerEntity)
    private readonly brokerRepo: Repository<BrokerEntity>,
    @InjectRepository(Account)
        private readonly accountRepo: Repository<Account>,
  ) {}

  async create(dto: CreateBrokerDto): Promise<BrokerEntity> {
    const broker = this.brokerRepo.create({
      brokerName: dto.brokerName,
      contactInfo: dto.contactInfo,
      defaultBrokerageRate: dto.defaultBrokerageRate ?? 0,
      company: { id: dto.companyId },
      account: dto.accountId ? { id: dto.accountId } : null,
    });
    return this.brokerRepo.save(broker);
  }

  async findAll(): Promise<BrokerEntity[]> {
    return this.brokerRepo.find();
  }

  async findOne(id: string): Promise<BrokerEntity> {
    const broker = await this.brokerRepo.findOne({ where: { id } });
    if (!broker) {
      throw new NotFoundException(`Broker with ID "${id}" not found`);
    }
    return broker;
  }

  async update(id: string, dto: UpdateBrokerDto): Promise<BrokerEntity> {
    const broker = await this.findOne(id);

    if (dto.brokerName !== undefined) {
      broker.brokerName = dto.brokerName;
    }
    if (dto.contactInfo !== undefined) {
      broker.contactInfo = dto.contactInfo;
    }
    if (dto.defaultBrokerageRate !== undefined) {
      broker.defaultBrokerageRate = dto.defaultBrokerageRate;
    }
    if (dto.accountId !== undefined) {
        if (dto.accountId) {
          const account = await this.accountRepo.findOne({ where: { id: dto.accountId } });
          if (!account) {
            throw new NotFoundException(`Account with ID "${dto.accountId}" not found`);
          }
          broker.account = account;
        } else {
          broker.account = null;
        }
      }

    return this.brokerRepo.save(broker);
  }

  async remove(id: string): Promise<void> {
    const broker = await this.findOne(id);
    await this.brokerRepo.remove(broker);
  }
}
