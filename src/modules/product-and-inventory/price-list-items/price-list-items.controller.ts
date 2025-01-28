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
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';

@ApiTags('Price List Items')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Controller('price-list-items')
@Roles(Role.Owner, Role.Admin)
export class PriceListItemsController {
  constructor(private readonly itemsService: PriceListItemsService) {}

  @ApiOperation({ summary: 'Create a new price list item' })
  @Post()
  @Permissions(PERMISSIONS.PRICE_LIST_ITEMS.CREATE)
  async create(@Body() dto: CreatePriceListItemDto) {
    return this.itemsService.create(dto);
  }

  @ApiOperation({ summary: 'Find all items in a price list' })
  @Get()
  @Permissions(PERMISSIONS.PRICE_LIST_ITEMS.READ)
  async findAll(
    @Query('priceListId', new ParseUUIDPipe({ optional: true }))
    priceListId?: string,
  ) {
    return this.itemsService.findAllByPriceListId(priceListId);
  }

  @ApiOperation({ summary: 'Get a single price list item by ID' })
  @Get(':id')
  @Permissions(PERMISSIONS.PRICE_LIST_ITEMS.READ)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.itemsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a price list item' })
  @Patch(':id')
  @Permissions(PERMISSIONS.PRICE_LIST_ITEMS.UPDATE)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePriceListItemDto,
  ) {
    return this.itemsService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete a price list item' })
  @Delete(':id')
  @Permissions(PERMISSIONS.PRICE_LIST_ITEMS.DELETE)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.itemsService.remove(id);
  }
}
