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
  import { ProductionOrdersService } from './production-orders.service';
  import { CreateProductionOrderDto } from './dtos/create-production-order.dto';
  import { UpdateProductionOrderDto } from './dtos/update-production-order.dto';
  import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
  import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
  import { RolesGuard } from 'src/common/guards/roles.guard';
  import { Roles } from 'src/common/decorators/roles.decorator';
  import { Role } from 'src/modules/auth/interfaces/role.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';
  
  @ApiTags('Production Orders')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Controller('production-orders')
  @Roles(Role.Owner, Role.Admin)
  export class ProductionOrdersController {
    constructor(private readonly ordersService: ProductionOrdersService) {}
  
    @ApiOperation({ summary: 'Create a new production order' })
    @Post()
    @Permissions(PERMISSIONS.PRODUCTION_ORDERS.CREATE)
    async create(@Body() dto: CreateProductionOrderDto) {
      return this.ordersService.create(dto);
    }
  
    @ApiOperation({ summary: 'Get all production orders for a company' })
    @Get()
    @Permissions(PERMISSIONS.PRODUCTION_ORDERS.READ)
    async findAll(@Query('companyId', ParseUUIDPipe) companyId: string) {
      return this.ordersService.findAllByCompanyId(companyId);
    }
  
    @ApiOperation({ summary: 'Get a production order by ID' })
    @Get(':id')
    @Permissions(PERMISSIONS.PRODUCTION_ORDERS.READ)
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.ordersService.findOne(id);
    }
  
    @ApiOperation({ summary: 'Update a production order' })
    @Patch(':id')
    @Permissions(PERMISSIONS.PRODUCTION_ORDERS.UPDATE)
    async update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() dto: UpdateProductionOrderDto,
    ) {
      return this.ordersService.update(id, dto);
    }
  
    @ApiOperation({ summary: 'Delete a production order' })
    @Delete(':id')
    @Permissions(PERMISSIONS.PRODUCTION_ORDERS.DELETE)
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.ordersService.remove(id);
    }
  }
  