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
  
  @ApiTags('Inventory')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('inventory')
  export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) {}
  
    @ApiOperation({ summary: 'Create a new inventory record' })
    @Roles(Role.Owner, Role.Admin)
    @Post()
    async create(@Body() dto: CreateInventoryDto) {
      return this.inventoryService.create(dto);
    }
  
    @ApiOperation({ summary: 'Get all inventory for a given company' })
    @Get()
    async findAll(@Query('companyId', ParseUUIDPipe) companyId: string) {
      return this.inventoryService.findAllByCompanyId(companyId);
    }
  
    @ApiOperation({ summary: 'Get a single inventory record by ID' })
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.inventoryService.findOne(id);
    }
  
    @ApiOperation({ summary: 'Update an inventory record' })
    @Roles(Role.Owner, Role.Admin)
    @Patch(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateInventoryDto) {
      return this.inventoryService.update(id, dto);
    }
  
    @ApiOperation({ summary: 'Delete an inventory record' })
    @Roles(Role.Owner, Role.Admin)
    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.inventoryService.remove(id);
    }
  }
  