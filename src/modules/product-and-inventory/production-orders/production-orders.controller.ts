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
  
  @ApiTags('Production Orders')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('production-orders')
  export class ProductionOrdersController {
    constructor(private readonly ordersService: ProductionOrdersService) {}
  
    @ApiOperation({ summary: 'Create a new production order' })
    @Roles(Role.Owner, Role.Admin)
    @Post()
    async create(@Body() dto: CreateProductionOrderDto) {
      return this.ordersService.create(dto);
    }
  
    @ApiOperation({ summary: 'Get all production orders for a company' })
    @Get()
    async findAll(@Query('companyId', ParseUUIDPipe) companyId: string) {
      return this.ordersService.findAllByCompanyId(companyId);
    }
  
    @ApiOperation({ summary: 'Get a production order by ID' })
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.ordersService.findOne(id);
    }
  
    @ApiOperation({ summary: 'Update a production order' })
    @Roles(Role.Owner, Role.Admin)
    @Patch(':id')
    async update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() dto: UpdateProductionOrderDto,
    ) {
      return this.ordersService.update(id, dto);
    }
  
    @ApiOperation({ summary: 'Delete a production order' })
    @Roles(Role.Owner, Role.Admin)
    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.ordersService.remove(id);
    }
  }
  