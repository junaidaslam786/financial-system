import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    Query,
    ParseUUIDPipe,
    UseGuards,
  } from '@nestjs/common';
  import { ProductCategoriesService } from './product-categories.service';
  import { CreateProductCategoryDto } from './dtos/create-product-category.dto';
  import { UpdateProductCategoryDto } from './dtos/update-product-category.dto';
  import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
  import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
  import { RolesGuard } from 'src/common/guards/roles.guard';
  import { Roles } from 'src/common/decorators/roles.decorator';
  import { Role } from 'src/modules/auth/interfaces/role.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';
  
  @ApiTags('Product Categories')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Controller('product-categories')
  @Roles(Role.Owner, Role.Admin)
  export class ProductCategoriesController {
    constructor(private readonly categoriesService: ProductCategoriesService) {}
  
    @ApiOperation({ summary: 'Create a new product category' })
    @Post()
    @Permissions(PERMISSIONS.PRODUCT_CATEGORIES.CREATE)
    async create(@Body() dto: CreateProductCategoryDto) {
      return this.categoriesService.createCategory(dto);
    }
  
    @ApiOperation({ summary: 'Get all categories for a company' })
    @Get()
    @Permissions(PERMISSIONS.PRODUCT_CATEGORIES.READ)
    async findAll(@Query('companyId', ParseUUIDPipe) companyId: string) {
      return this.categoriesService.findAllCategories(companyId);
    }
  
    @ApiOperation({ summary: 'Get product category by ID' })
    @Get(':id')
    @Permissions(PERMISSIONS.PRODUCT_CATEGORIES.READ)
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.categoriesService.findOneCategory(id);
    }
  
    @ApiOperation({ summary: 'Update a product category' })
    @Patch(':id')
    @Permissions(PERMISSIONS.PRODUCT_CATEGORIES.UPDATE)
    async update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() dto: UpdateProductCategoryDto,
    ) {
      return this.categoriesService.updateCategory(id, dto);
    }
  
    @ApiOperation({ summary: 'Delete a product category' })
    @Delete(':id')
    @Permissions(PERMISSIONS.PRODUCT_CATEGORIES.DELETE)
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.categoriesService.removeCategory(id);
    }
  }
  