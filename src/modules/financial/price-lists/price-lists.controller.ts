import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    Query,
  } from '@nestjs/common';
  import { PriceListsService } from './price-lists.service';
  import { CreatePriceListDto } from './dtos/create-price-list.dto';
  import { UpdatePriceListDto } from './dtos/update-price-list.dto';
  import { PriceList } from './entities/price-list.entity';
  
  @Controller('price-lists')
  export class PriceListsController {
    constructor(private readonly priceListsService: PriceListsService) {}
  
    @Post()
    async create(@Body() dto: CreatePriceListDto): Promise<PriceList> {
      return this.priceListsService.create(dto);
    }
  
    @Get()
    async findAll(@Query('companyId') companyId: string): Promise<PriceList[]> {
      return this.priceListsService.findAll(companyId);
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<PriceList> {
      return this.priceListsService.findOne(id);
    }
  
    @Patch(':id')
    async update(
      @Param('id') id: string,
      @Body() dto: UpdatePriceListDto,
    ): Promise<PriceList> {
      return this.priceListsService.update(id, dto);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
      return this.priceListsService.remove(id);
    }
  }
  