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
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';


  @ApiBearerAuth()
  @ApiTags('Exchange Rates')
  @Controller('exchange-rates')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard) 
  @Roles(Role.Owner, Role.Admin)
  export class ExchangeRatesController {
    constructor(private readonly exchangeRatesService: ExchangeRatesService) {}
  
    @Post()
    @Permissions(PERMISSIONS.EXCHANGE_RATES.CREATE)
    async create(@Body() dto: CreateExchangeRateDto): Promise<ExchangeRate> {
      return this.exchangeRatesService.create(dto);
    }
  
    @Get('company/:companyId')
    @Permissions(PERMISSIONS.EXCHANGE_RATES.READ)
    async findAll(@Param('companyId', ParseUUIDPipe) companyId: string): Promise<ExchangeRate[]> {
      if (!companyId) {
        throw new BadRequestException('companyId param is required');
      }
      return this.exchangeRatesService.findAll(companyId);
    }
  
    @Get(':id')
    @Permissions(PERMISSIONS.EXCHANGE_RATES.READ)
    async findOne(@Param('id') id: string): Promise<ExchangeRate> {
      return this.exchangeRatesService.findOne(id);
    }
  
    @Patch(':id')
    @Permissions(PERMISSIONS.EXCHANGE_RATES.UPDATE)
    async update(
      @Param('id') id: string,
      @Body() dto: UpdateExchangeRateDto,
    ): Promise<ExchangeRate> {
      return this.exchangeRatesService.update(id, dto);
    }
  
    @Delete(':id')
    @Permissions(PERMISSIONS.EXCHANGE_RATES.DELETE)
    async remove(@Param('id') id: string): Promise<void> {
      return this.exchangeRatesService.remove(id);
    }
  }
  