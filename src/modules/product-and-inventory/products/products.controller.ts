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
  import { ProductsService } from './products.service';
  import { CreateProductDto } from './dtos/create-product.dto';
  import { UpdateProductDto } from './dtos/update-product.dto';
  import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
  import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
  import { RolesGuard } from 'src/common/guards/roles.guard';
  import { Roles } from 'src/common/decorators/roles.decorator';
  import { Role } from 'src/modules/auth/interfaces/role.enum';
  
  @ApiTags('Products')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('products')
  export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}
  
    @ApiOperation({ summary: 'Create a new product' })
    @Roles(Role.Owner, Role.Admin)
    @Post()
    async create(@Body() dto: CreateProductDto) {
      return this.productsService.create(dto);
    }
  
    @ApiOperation({ summary: 'Get all products for a given company' })
    @Get()
    async findAll(@Query('companyId', ParseUUIDPipe) companyId: string) {
      return this.productsService.findAll(companyId);
    }
  
    @ApiOperation({ summary: 'Get a product by ID' })
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.productsService.findOne(id);
    }
  
    @ApiOperation({ summary: 'Update a product' })
    @Roles(Role.Owner, Role.Admin)
    @Patch(':id')
    async update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() dto: UpdateProductDto,
    ) {
      return this.productsService.update(id, dto);
    }
  
    @ApiOperation({ summary: 'Delete a product' })
    @Roles(Role.Owner, Role.Admin)
    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.productsService.remove(id);
    }
  }
  