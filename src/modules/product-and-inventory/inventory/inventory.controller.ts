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
  import { InventoryService } from './inventory.service';
  import { CreateInventoryDto } from './dtos/create-inventory.dto';
  import { UpdateInventoryDto } from './dtos/update-inventory.dto';
  import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
  import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
  import { RolesGuard } from 'src/common/guards/roles.guard';
  import { Roles } from 'src/common/decorators/roles.decorator';
  import { Role } from 'src/modules/auth/interfaces/role.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';
  
  @ApiTags('Inventory')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Controller('inventory')
  @Roles(Role.Owner, Role.Admin)
  export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) {}
  
    @ApiOperation({ summary: 'Create a new inventory record' })
    @Post()
    @Permissions(PERMISSIONS.INVENTORY.CREATE)
    async create(@Body() dto: CreateInventoryDto) {
      return this.inventoryService.create(dto);
    }
  
    @ApiOperation({ summary: 'Get all inventory for a given company' })
    @Get()
    @Permissions(PERMISSIONS.INVENTORY.READ)
    async findAll(@Query('companyId', ParseUUIDPipe) companyId: string) {
      return this.inventoryService.findAllByCompanyId(companyId);
    }
  
    @ApiOperation({ summary: 'Get a single inventory record by ID' })
    @Get(':id')
    @Permissions(PERMISSIONS.INVENTORY.READ)
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.inventoryService.findOne(id);
    }
  
    @ApiOperation({ summary: 'Update an inventory record' })
    @Patch(':id')
    @Permissions(PERMISSIONS.INVENTORY.UPDATE)
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateInventoryDto) {
      return this.inventoryService.update(id, dto);
    }
  
    @ApiOperation({ summary: 'Delete an inventory record' })
    @Delete(':id')
    @Permissions(PERMISSIONS.INVENTORY.DELETE)
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.inventoryService.remove(id);
    }
  }
  