import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
  } from '@nestjs/common';
  import { ExchangeRatesService } from './exchange-rates.service';
  import { CreateExchangeRateDto } from './dtos/create-exchange-rate.dto';
  import { UpdateExchangeRateDto } from './dtos/update-exchange-rate.dto';
  import { ExchangeRate } from './entities/exchange-rate.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


  @ApiBearerAuth()
  @ApiTags('Exchange Rates')
  @Controller('exchange-rates')
  export class ExchangeRatesController {
    constructor(private readonly exchangeRatesService: ExchangeRatesService) {}
  
    @Post()
    async create(@Body() dto: CreateExchangeRateDto): Promise<ExchangeRate> {
      return this.exchangeRatesService.create(dto);
    }
  
    @Get()
    async findAll(): Promise<ExchangeRate[]> {
      return this.exchangeRatesService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ExchangeRate> {
      return this.exchangeRatesService.findOne(id);
    }
  
    @Patch(':id')
    async update(
      @Param('id') id: string,
      @Body() dto: UpdateExchangeRateDto,
    ): Promise<ExchangeRate> {
      return this.exchangeRatesService.update(id, dto);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
      return this.exchangeRatesService.remove(id);
    }
  }
  