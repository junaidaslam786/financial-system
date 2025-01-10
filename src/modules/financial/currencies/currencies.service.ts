import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from './entities/currency.entity';
import { CreateCurrencyDto } from './dtos/create-currency.dto';
import { UpdateCurrencyDto } from './dtos/update-currency.dto';
import { InvalidCurrencyException } from './../../../common/exceptions/invalid-currency.exception';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepo: Repository<Currency>,
  ) {}

  async create(createDto: CreateCurrencyDto): Promise<Currency> {
    // Optional custom validation
    if (createDto.currencyCode.trim() === '') {
      throw new InvalidCurrencyException('Currency code cannot be empty');
    }

    const currency = this.currencyRepo.create(createDto);
    return await this.currencyRepo.save(currency);
  }

  async findAll(companyId: string): Promise<Currency[]> {
    return this.currencyRepo.find({
      where: { company: { id: companyId } },
      relations: ['company'],
    });
  }

  async findOne(id: string): Promise<Currency> {
    const currency = await this.currencyRepo.findOne({ where: { id } });
    if (!currency) {
      throw new NotFoundException(`Currency with ID "${id}" not found`);
    }
    return currency;
  }

  async update(id: string, updateDto: UpdateCurrencyDto): Promise<Currency> {
    const currency = await this.findOne(id);

    Object.assign(currency, updateDto);
    return this.currencyRepo.save(currency);
  }

  async remove(id: string): Promise<void> {
    const currency = await this.findOne(id);
    await this.currencyRepo.remove(currency);
  }
}
