import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
  } from '@nestjs/common';
  import { CurrenciesService } from './currencies.service';
  import { CreateCurrencyDto } from './dtos/create-currency.dto';
  import { UpdateCurrencyDto } from './dtos/update-currency.dto';
  import { Currency } from './entities/currency.entity';
  
  @Controller('currencies')
  export class CurrenciesController {
    constructor(private readonly currenciesService: CurrenciesService) {}
  
    @Post()
    async create(@Body() dto: CreateCurrencyDto): Promise<Currency> {
      return this.currenciesService.create(dto);
    }
  
    @Get()
    async findAll(): Promise<Currency[]> {
      return this.currenciesService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Currency> {
      return this.currenciesService.findOne(id);
    }
  
    @Patch(':id')
    async update(
      @Param('id') id: string,
      @Body() dto: UpdateCurrencyDto,
    ): Promise<Currency> {
      return this.currenciesService.update(id, dto);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
      return this.currenciesService.remove(id);
    }
  }
  