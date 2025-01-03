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
  import { WarehousesService } from './warehouses.service';
  import { CreateWarehouseDto } from './dtos/create-warehouse.dto';
  import { UpdateWarehouseDto } from './dtos/update-warehouse.dto';
  import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
  import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
  import { RolesGuard } from 'src/common/guards/roles.guard';
  import { Roles } from 'src/common/decorators/roles.decorator';
  import { Role } from 'src/modules/auth/interfaces/role.enum';
  
  @ApiTags('Warehouses')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('warehouses')
  export class WarehousesController {
    constructor(private readonly warehousesService: WarehousesService) {}
  
    @ApiOperation({ summary: 'Create a new warehouse' })
    @Roles(Role.Owner, Role.Admin)
    @Post()
    async create(@Body() dto: CreateWarehouseDto) {
      return this.warehousesService.create(dto);
    }
  
    @ApiOperation({ summary: 'Get all warehouses for a company' })
    @Get()
    async findAll(@Query('companyId', ParseUUIDPipe) companyId: string) {
      return this.warehousesService.findAllByCompanyId(companyId);
    }
  
    @ApiOperation({ summary: 'Get a warehouse by ID' })
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.warehousesService.findOne(id);
    }
  
    @ApiOperation({ summary: 'Update a warehouse' })
    @Roles(Role.Owner, Role.Admin)
    @Patch(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateWarehouseDto) {
      return this.warehousesService.update(id, dto);
    }
  
    @ApiOperation({ summary: 'Delete a warehouse' })
    @Roles(Role.Owner, Role.Admin)
    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.warehousesService.remove(id);
    }
  }
  