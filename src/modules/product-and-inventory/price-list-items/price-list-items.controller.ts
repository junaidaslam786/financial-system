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
  import { PriceListItemsService } from './price-list-items.service';
  import { CreatePriceListItemDto } from './dtos/create-price-list-item.dto';
  import { UpdatePriceListItemDto } from './dtos/update-price-list-item.dto';
  import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
  import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
  import { RolesGuard } from 'src/common/guards/roles.guard';
  import { Roles } from 'src/common/decorators/roles.decorator';
  import { Role } from 'src/modules/auth/interfaces/role.enum';
  
  @ApiTags('Price List Items')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('price-list-items')
  export class PriceListItemsController {
    constructor(private readonly itemsService: PriceListItemsService) {}
  
    @ApiOperation({ summary: 'Create a new price list item' })
    @Roles(Role.Owner, Role.Admin)
    @Post()
    async create(@Body() dto: CreatePriceListItemDto) {
      return this.itemsService.create(dto);
    }
  
    @ApiOperation({ summary: 'Find all items in a price list' })
    @Get()
    async findAll(@Query('priceListId', ParseUUIDPipe) priceListId: string) {
      return this.itemsService.findAllByPriceListId(priceListId);
    }
  
    @ApiOperation({ summary: 'Get a single price list item by ID' })
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.itemsService.findOne(id);
    }
  
    @ApiOperation({ summary: 'Update a price list item' })
    @Roles(Role.Owner, Role.Admin)
    @Patch(':id')
    async update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() dto: UpdatePriceListItemDto,
    ) {
      return this.itemsService.update(id, dto);
    }
  
    @ApiOperation({ summary: 'Delete a price list item' })
    @Roles(Role.Owner, Role.Admin)
    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.itemsService.remove(id);
    }
  }
  