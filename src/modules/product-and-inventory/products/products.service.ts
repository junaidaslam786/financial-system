import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  async create(dto: CreateProductDto): Promise<ProductEntity> {
    // Optional: Validate references, e.g. ensure category/company exist
    // or do a service call to check them. For brevity, skip it here.

    // Check if SKU is unique if provided:
    if (dto.sku) {
      const existingSku = await this.productRepo.findOne({ where: { sku: dto.sku } });
      if (existingSku) {
        throw new BadRequestException(`SKU "${dto.sku}" already exists`);
      }
    }

    const product = this.productRepo.create({
      companyId: dto.companyId,
      categoryId: dto.categoryId,
      productName: dto.productName,
      sku: dto.sku,
      productType: dto.productType ?? 'RawMaterial',
      unitOfMeasureId: dto.unitOfMeasureId,
      costPrice: dto.costPrice ?? 0,
      sellingPrice: dto.sellingPrice ?? 0,
      isActive: dto.isActive ?? true,
    });
    return this.productRepo.save(product);
  }

  async findAll(companyId: string): Promise<ProductEntity[]> {
    // Return products for a given company
    return this.productRepo.find({
      where: { companyId },
      order: { productName: 'ASC' },
    });
  }

  async findOne(id: string): Promise<ProductEntity> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductEntity> {
    const product = await this.findOne(id);

    if (dto.sku !== undefined && dto.sku !== product.sku) {
      // Validate new SKU is unique
      const existingSku = await this.productRepo.findOne({ where: { sku: dto.sku } });
      if (existingSku) {
        throw new BadRequestException(`SKU "${dto.sku}" already exists`);
      }
      product.sku = dto.sku;
    }

    if (dto.productName !== undefined) product.productName = dto.productName;
    if (dto.categoryId !== undefined) product.categoryId = dto.categoryId;
    if (dto.productType !== undefined) product.productType = dto.productType;
    if (dto.unitOfMeasureId !== undefined) product.unitOfMeasureId = dto.unitOfMeasureId;
    if (dto.costPrice !== undefined) product.costPrice = dto.costPrice;
    if (dto.sellingPrice !== undefined) product.sellingPrice = dto.sellingPrice;
    if (dto.isActive !== undefined) product.isActive = dto.isActive;

    return this.productRepo.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);

    // If there are references to this product in price_list_items or inventory,
    // you could do checks or rely on ON DELETE SET NULL or CASCADE

    await this.productRepo.remove(product);
  }
}
