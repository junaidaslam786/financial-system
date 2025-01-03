import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateProductCategoryDto {
  @ApiProperty({ example: 'abc123-...', description: 'Company ID' })
  @IsUUID()
  companyId: string;

  @ApiProperty({ example: 'Grains', description: 'Name of the category' })
  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @ApiProperty({ example: 'xyz456-...', description: 'Parent category ID', required: false })
  @IsOptional()
  @IsUUID()
  parentCategoryId?: string;
}
