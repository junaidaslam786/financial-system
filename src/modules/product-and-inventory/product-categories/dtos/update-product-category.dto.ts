import { PartialType } from '@nestjs/mapped-types';
import { CreateProductCategoryDto } from './create-product-category.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductCategoryDto extends PartialType(CreateProductCategoryDto) {
  @ApiPropertyOptional({ example: 'Grains Updated' })
  categoryName?: string;
}
