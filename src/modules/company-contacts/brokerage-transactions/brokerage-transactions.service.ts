import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrokerageTransactionEntity } from './entities/brokerage-transaction.entity';
import { CreateBrokerageTransactionDto } from './dtos/create-brokerage-transaction.dto';
import { UpdateBrokerageTransactionDto } from './dtos/update-brokerage-transaction.dto';

@Injectable()
export class BrokerageTransactionsService {
  constructor(
    @InjectRepository(BrokerageTransactionEntity)
    private readonly txnRepo: Repository<BrokerageTransactionEntity>,
  ) {}

  async create(dto: CreateBrokerageTransactionDto): Promise<BrokerageTransactionEntity> {
    const txn = this.txnRepo.create({
      broker: { id: dto.brokerId },
      relatedDocumentId: dto.relatedDocumentId,
      documentType: dto.documentType,
      brokerageAmount: dto.brokerageAmount,
    });
    return this.txnRepo.save(txn);
  }

  async findAll(): Promise<BrokerageTransactionEntity[]> {
    return this.txnRepo.find();
  }

  async findOne(id: string): Promise<BrokerageTransactionEntity> {
    const txn = await this.txnRepo.findOne({ where: { id } });
    if (!txn) {
      throw new NotFoundException(`BrokerageTransaction with ID "${id}" not found`);
    }
    return txn;
  }

  async update(id: string, dto: UpdateBrokerageTransactionDto): Promise<BrokerageTransactionEntity> {
    const txn = await this.findOne(id);

    if (dto.brokerId !== undefined) {
      txn.broker = { id: dto.brokerId } as any;
    }
    if (dto.relatedDocumentId !== undefined) {
      txn.relatedDocumentId = dto.relatedDocumentId;
    }
    if (dto.documentType !== undefined) {
      txn.documentType = dto.documentType;
    }
    if (dto.brokerageAmount !== undefined) {
      txn.brokerageAmount = dto.brokerageAmount;
    }

    return this.txnRepo.save(txn);
  }

  async remove(id: string): Promise<void> {
    const txn = await this.findOne(id);
    await this.txnRepo.remove(txn);
  }
}
