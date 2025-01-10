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
  
  @ApiBearerAuth()
  @ApiTags('Price Lists')
  @Controller('price-lists')
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(Role.Owner, Role.Admin)
  export class PriceListsController {
    constructor(private readonly priceListsService: PriceListsService) {}
  
    @Post()
    async create(@Body() dto: CreatePriceListDto): Promise<PriceList> {
      return this.priceListsService.create(dto);
    }
  
    @Get()
    async findAll(@Query('companyId') companyId: string): Promise<PriceList[]> {
      if (!companyId) {
        throw new BadRequestException('companyId param is required');
      }
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
  