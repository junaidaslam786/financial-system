import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategoryEntity } from './entities/product-category.entity';
import { CreateProductCategoryDto } from './dtos/create-product-category.dto';
import { UpdateProductCategoryDto } from './dtos/update-product-category.dto';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategoryEntity)
    private readonly categoryRepo: Repository<ProductCategoryEntity>,
  ) {}

  async createCategory(dto: CreateProductCategoryDto): Promise<ProductCategoryEntity> {
    // Optional: Check if parent category exists
    let parentCategory: ProductCategoryEntity | null = null;
    if (dto.parentCategoryId) {
      parentCategory = await this.categoryRepo.findOne({
        where: { id: dto.parentCategoryId },
      });
      if (!parentCategory) {
        throw new NotFoundException(
          `Parent category with ID "${dto.parentCategoryId}" not found`,
        );
      }
    }

    const category = this.categoryRepo.create({
      companyId: dto.companyId,
      categoryName: dto.categoryName,
      parentCategoryId: dto.parentCategoryId || null,
    });

    return this.categoryRepo.save(category);
  }

  async findAllCategories(companyId: string): Promise<ProductCategoryEntity[]> {
    // Return all categories for the given company
    return this.categoryRepo.find({
      where: { companyId },
      order: { createdAt: 'ASC' },
    });
  }

  async findOneCategory(id: string): Promise<ProductCategoryEntity> {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Product category with ID "${id}" not found`);
    }
    return category;
  }

  async updateCategory(
    id: string,
    dto: UpdateProductCategoryDto,
  ): Promise<ProductCategoryEntity> {
    const category = await this.findOneCategory(id);

    if (dto.parentCategoryId !== undefined) {
      // Check if parent exists
      if (dto.parentCategoryId) {
        const parentCat = await this.categoryRepo.findOne({
          where: { id: dto.parentCategoryId },
        });
        if (!parentCat) {
          throw new NotFoundException(
            `Parent category with ID "${dto.parentCategoryId}" not found`,
          );
        }
        category.parentCategoryId = dto.parentCategoryId;
      } else {
        category.parentCategoryId = null;
      }
    }
    if (dto.categoryName !== undefined) {
      category.categoryName = dto.categoryName;
    }

    return this.categoryRepo.save(category);
  }

  async removeCategory(id: string): Promise<void> {
    const category = await this.findOneCategory(id);
    // Optional: Check if it has subcategories
    const subcategories = await this.categoryRepo.find({
      where: { parentCategoryId: category.id },
      select: ['id'],
    });
    if (subcategories.length > 0) {
      throw new BadRequestException(
        `Cannot delete category with subcategories. Remove or reassign them first.`,
      );
    }

    await this.categoryRepo.remove(category);
  }
}
