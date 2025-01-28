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
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';

  @ApiBearerAuth()
  @ApiTags('Currencies')
  @Controller('currencies')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard) 
  @Roles(Role.Owner, Role.Admin)
  export class CurrenciesController {
    constructor(private readonly currenciesService: CurrenciesService) {}
  
    @Post()
    @Permissions(PERMISSIONS.CURRENCIES.CREATE)
    async create(@Body() dto: CreateCurrencyDto): Promise<Currency> {
      return this.currenciesService.create(dto);
    }
  
    @Get('company/:companyId')
    @Permissions(PERMISSIONS.CURRENCIES.READ)
    async findAll(@Param('companyId', ParseUUIDPipe) companyId: string): Promise<Currency[]> {
      if (!companyId) {
        throw new BadRequestException('companyId param is required');
      }
      return this.currenciesService.findAll(companyId);
    }
  
    @Get(':id')
    @Permissions(PERMISSIONS.CURRENCIES.READ)
    async findOne(@Param('id') id: string): Promise<Currency> {
      return this.currenciesService.findOne(id);
    }
  
    @Patch(':id')
    @Permissions(PERMISSIONS.CURRENCIES.UPDATE)
    async update(
      @Param('id') id: string,
      @Body() dto: UpdateCurrencyDto,
    ): Promise<Currency> {
      return this.currenciesService.update(id, dto);
    }
  
    @Delete(':id')
    @Permissions(PERMISSIONS.CURRENCIES.DELETE)
    async remove(@Param('id') id: string): Promise<void> {
      return this.currenciesService.remove(id);
    }
  }
  