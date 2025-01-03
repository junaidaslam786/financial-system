import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceListItemEntity } from './entities/price-list-item.entity';
import { CreatePriceListItemDto } from './dtos/create-price-list-item.dto';
import { UpdatePriceListItemDto } from './dtos/update-price-list-item.dto';

@Injectable()
export class PriceListItemsService {
  constructor(
    @InjectRepository(PriceListItemEntity)
    private readonly itemRepo: Repository<PriceListItemEntity>,
  ) {}

  async create(dto: CreatePriceListItemDto): Promise<PriceListItemEntity> {
    // Optionally, validate that price_list_id and product_id exist in DB
    // (We rely on FK constraints, but can do an explicit check if desired.)

    // Check if there's an existing item for the same product in the same price_list
    const existing = await this.itemRepo.findOne({
      where: {
        priceListId: dto.priceListId,
        productId: dto.productId,
      },
    });
    if (existing) {
      throw new BadRequestException(
        `Price List Item for product "${dto.productId}" already exists in Price List "${dto.priceListId}"`,
      );
    }

    const item = this.itemRepo.create({
      priceListId: dto.priceListId,
      productId: dto.productId,
      price: dto.price ?? 0,
    });
    return this.itemRepo.save(item);
  }

  async findAllByPriceListId(priceListId: string): Promise<PriceListItemEntity[]> {
    return this.itemRepo.find({
      where: { priceListId },
      order: { productId: 'ASC' }, // or whichever ordering you prefer
    });
  }

  async findOne(id: string): Promise<PriceListItemEntity> {
    const item = await this.itemRepo.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`PriceListItem with ID "${id}" not found`);
    }
    return item;
  }

  async update(id: string, dto: UpdatePriceListItemDto): Promise<PriceListItemEntity> {
    const item = await this.findOne(id);

    if (dto.priceListId !== undefined && dto.priceListId !== item.priceListId) {
      // Optionally check if new PriceList exists
      // Or rely on FK constraint
      item.priceListId = dto.priceListId;
    }
    if (dto.productId !== undefined && dto.productId !== item.productId) {
      // Check for duplicates in the new combination if needed
      const existing = await this.itemRepo.findOne({
        where: {
          priceListId: dto.priceListId ?? item.priceListId,
          productId: dto.productId,
        },
      });
      if (existing) {
        throw new BadRequestException(
          `Another item with productId "${dto.productId}" already exists in Price List`,
        );
      }
      item.productId = dto.productId;
    }
    if (dto.price !== undefined) {
      item.price = dto.price;
    }

    return this.itemRepo.save(item);
  }

  async remove(id: string): Promise<void> {
    const item = await this.findOne(id);
    await this.itemRepo.remove(item);
  }
}
