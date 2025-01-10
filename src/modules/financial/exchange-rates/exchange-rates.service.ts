import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExchangeRate } from './entities/exchange-rate.entity';
import { CreateExchangeRateDto } from './dtos/create-exchange-rate.dto';
import { UpdateExchangeRateDto } from './dtos/update-exchange-rate.dto';

@Injectable()
export class ExchangeRatesService {
  constructor(
    @InjectRepository(ExchangeRate)
    private readonly exchangeRateRepo: Repository<ExchangeRate>,
  ) {}

  async create(dto: CreateExchangeRateDto): Promise<ExchangeRate> {
    // Basic rule: baseCurrency != targetCurrency
    if (dto.baseCurrency === dto.targetCurrency) {
      throw new Error('Base currency and target currency must be different');
    }

    const exchangeRate = this.exchangeRateRepo.create(dto);
    return this.exchangeRateRepo.save(exchangeRate);
  }

  async findAll(companyId: string): Promise<ExchangeRate[]> {
    return this.exchangeRateRepo.find({
      where: { company: { id: companyId } },
      relations: ['company'],
    });
  }

  async findOne(id: string): Promise<ExchangeRate> {
    const rate = await this.exchangeRateRepo.findOne({ where: { id } });
    if (!rate) {
      throw new NotFoundException(`Exchange rate with ID "${id}" not found`);
    }
    return rate;
  }

  async update(id: string, dto: UpdateExchangeRateDto): Promise<ExchangeRate> {
    const rate = await this.findOne(id);
    Object.assign(rate, dto);
    return this.exchangeRateRepo.save(rate);
  }

  async remove(id: string): Promise<void> {
    const rate = await this.findOne(id);
    await this.exchangeRateRepo.remove(rate);
  }
}
