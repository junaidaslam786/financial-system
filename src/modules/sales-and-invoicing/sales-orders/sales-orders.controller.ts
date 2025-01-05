import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { SalesOrdersService } from './sales-orders.service';
import { CreateSalesOrderDto } from './dtos/create-sales-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/modules/auth/interfaces/role.enum';

@ApiBearerAuth()
@ApiTags('Sales Orders')
@Controller('sales-orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Owner, Role.Admin)
export class SalesOrdersController {
  constructor(private readonly salesOrdersService: SalesOrdersService) {}

  @Post()
  async create(@Body() dto: CreateSalesOrderDto) {
    return this.salesOrdersService.create(dto);
  }

  @Get(':companyId')
  async findAll(@Param('companyId') companyId: string) {
    return this.salesOrdersService.findAll(companyId);
  }

  @Get('order/:id')
  async findOne(@Param('id') id: string) {
    return this.salesOrdersService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: CreateSalesOrderDto) {
    return this.salesOrdersService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.salesOrdersService.remove(id);
  }
}
