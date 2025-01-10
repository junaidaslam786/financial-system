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
  import { CurrenciesService } from './currencies.service';
  import { CreateCurrencyDto } from './dtos/create-currency.dto';
  import { UpdateCurrencyDto } from './dtos/update-currency.dto';
  import { Currency } from './entities/currency.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/modules/auth/interfaces/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

  @ApiBearerAuth()
  @ApiTags('Currencies')
  @Controller('currencies')
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(Role.Owner, Role.Admin)
  export class CurrenciesController {
    constructor(private readonly currenciesService: CurrenciesService) {}
  
    @Post()
    async create(@Body() dto: CreateCurrencyDto): Promise<Currency> {
      return this.currenciesService.create(dto);
    }
  
    @Get('company/:companyId')
    async findAll(@Param('companyId', ParseUUIDPipe) companyId: string): Promise<Currency[]> {
      if (!companyId) {
        throw new BadRequestException('companyId param is required');
      }
      return this.currenciesService.findAll(companyId);
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
  