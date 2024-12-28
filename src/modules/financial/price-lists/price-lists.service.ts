import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceList } from './entities/price-list.entity';
import { CreatePriceListDto } from './dtos/create-price-list.dto';
import { UpdatePriceListDto } from './dtos/update-price-list.dto';

@Injectable()
export class PriceListsService {
  constructor(
    @InjectRepository(PriceList)
    private readonly priceListRepo: Repository<PriceList>,
  ) {}

  async create(dto: CreatePriceListDto): Promise<PriceList> {
    // Optional: If isDefault === true, you might want to unset the current default
    // for that company. Example:
    if (dto.isDefault) {
      await this.priceListRepo.update(
        { company: { id: dto.companyId } },
        { isDefault: false },
      );
    }

    const entity = this.priceListRepo.create({
      company: { id: dto.companyId } as any,
      listName: dto.listName,
      currency: dto.currency,
      isDefault: dto.isDefault ?? false,
    });
    return this.priceListRepo.save(entity);
  }

  async findAll(companyId: string): Promise<PriceList[]> {
    return this.priceListRepo.find({
      where: { company: { id: companyId } },
    });
  }

  async findOne(id: string): Promise<PriceList> {
    const list = await this.priceListRepo.findOne({ where: { id } });
    if (!list) {
      throw new NotFoundException(`PriceList with ID "${id}" not found`);
    }
    return list;
  }

  async update(id: string, dto: UpdatePriceListDto): Promise<PriceList> {
    const list = await this.findOne(id);

    if (dto.companyId) {
      list.company = { id: dto.companyId } as any;
    }
    if (dto.listName !== undefined) {
      list.listName = dto.listName;
    }
    if (dto.currency !== undefined) {
      list.currency = dto.currency;
    }
    if (dto.isDefault !== undefined && dto.isDefault === true) {
      // Unset existing default for the company
      await this.priceListRepo.update(
        { company: { id: list.company.id } },
        { isDefault: false },
      );
      list.isDefault = true;
    } else if (dto.isDefault === false) {
      list.isDefault = false;
    }

    return this.priceListRepo.save(list);
  }

  async remove(id: string): Promise<void> {
    const list = await this.findOne(id);
    await this.priceListRepo.remove(list);
  }
}
