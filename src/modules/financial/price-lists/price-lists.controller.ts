import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    Query,
    UseGuards,
    BadRequestException,
  } from '@nestjs/common';
  import { PriceListsService } from './price-lists.service';
  import { CreatePriceListDto } from './dtos/create-price-list.dto';
  import { UpdatePriceListDto } from './dtos/update-price-list.dto';
  import { PriceList } from './entities/price-list.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Role } from 'src/modules/auth/interfaces/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';
  
  @ApiBearerAuth()
  @ApiTags('Price Lists')
  @Controller('price-lists')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard) 
  @Roles(Role.Owner, Role.Admin)
  export class PriceListsController {
    constructor(private readonly priceListsService: PriceListsService) {}
  
    @Post()
    @Permissions(PERMISSIONS.PRICE_LISTS.CREATE)
    async create(@Body() dto: CreatePriceListDto): Promise<PriceList> {
      return this.priceListsService.create(dto);
    }
  
    @Get()
    @Permissions(PERMISSIONS.PRICE_LISTS.READ)
    async findAll(@Query('companyId') companyId: string): Promise<PriceList[]> {
      if (!companyId) {
        throw new BadRequestException('companyId param is required');
      }
      return this.priceListsService.findAll(companyId);
    }
  
    @Get(':id')
    @Permissions(PERMISSIONS.PRICE_LISTS.READ)
    async findOne(@Param('id') id: string): Promise<PriceList> {
      return this.priceListsService.findOne(id);
    }
  
    @Patch(':id')
    @Permissions(PERMISSIONS.PRICE_LISTS.UPDATE)
    async update(
      @Param('id') id: string,
      @Body() dto: UpdatePriceListDto,
    ): Promise<PriceList> {
      return this.priceListsService.update(id, dto);
    }
  
    @Delete(':id')
    @Permissions(PERMISSIONS.PRICE_LISTS.DELETE)
    async remove(@Param('id') id: string): Promise<void> {
      return this.priceListsService.remove(id);
    }
  }
  