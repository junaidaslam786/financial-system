import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
    ParseUUIDPipe,
    BadRequestException,
  } from '@nestjs/common';
  import { ExchangeRatesService } from './exchange-rates.service';
  import { CreateExchangeRateDto } from './dtos/create-exchange-rate.dto';
  import { UpdateExchangeRateDto } from './dtos/update-exchange-rate.dto';
  import { ExchangeRate } from './entities/exchange-rate.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Role } from 'src/modules/auth/interfaces/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';


  @ApiBearerAuth()
  @ApiTags('Exchange Rates')
  @Controller('exchange-rates')
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(Role.Owner, Role.Admin)
  export class ExchangeRatesController {
    constructor(private readonly exchangeRatesService: ExchangeRatesService) {}
  
    @Post()
    async create(@Body() dto: CreateExchangeRateDto): Promise<ExchangeRate> {
      return this.exchangeRatesService.create(dto);
    }
  
    @Get('company/:companyId')
    async findAll(@Param('companyId', ParseUUIDPipe) companyId: string): Promise<ExchangeRate[]> {
      if (!companyId) {
        throw new BadRequestException('companyId param is required');
      }
      return this.exchangeRatesService.findAll(companyId);
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
  