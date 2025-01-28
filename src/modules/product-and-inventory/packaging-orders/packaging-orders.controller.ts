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
  import { PackagingOrdersService } from './packaging-orders.service';
  import { CreatePackagingOrderDto } from './dtos/create-packaging-order.dto';
  import { UpdatePackagingOrderDto } from './dtos/update-packaging-order.dto';
  import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
  import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
  import { RolesGuard } from 'src/common/guards/roles.guard';
  import { Roles } from 'src/common/decorators/roles.decorator';
  import { Role } from 'src/modules/auth/interfaces/role.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';
  
  @ApiTags('Packaging Orders')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Controller('packaging-orders')
  @Roles(Role.Owner, Role.Admin)
  export class PackagingOrdersController {
    constructor(private readonly pkgOrdersService: PackagingOrdersService) {}
  
    @ApiOperation({ summary: 'Create a new packaging order' })
    @Post()
    @Permissions(PERMISSIONS.PACKAGING_ORDERS.CREATE)
    async create(@Body() dto: CreatePackagingOrderDto) {
      return this.pkgOrdersService.create(dto);
    }
  
    @ApiOperation({ summary: 'Get all packaging orders for a company' })
    @Get()
    @Permissions(PERMISSIONS.PACKAGING_ORDERS.READ)
    async findAll(@Query('companyId', ParseUUIDPipe) companyId: string) {
      return this.pkgOrdersService.findAllByCompanyId(companyId);
    }
  
    @ApiOperation({ summary: 'Get a single packaging order by ID' })
    @Get(':id')
    @Permissions(PERMISSIONS.PACKAGING_ORDERS.READ)
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.pkgOrdersService.findOne(id);
    }
  
    @ApiOperation({ summary: 'Update a packaging order' })
    @Patch(':id')
    @Permissions(PERMISSIONS.PACKAGING_ORDERS.UPDATE)
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePackagingOrderDto) {
      return this.pkgOrdersService.update(id, dto);
    }
  
    @ApiOperation({ summary: 'Delete a packaging order' })
    @Delete(':id')
    @Permissions(PERMISSIONS.PACKAGING_ORDERS.DELETE)
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.pkgOrdersService.remove(id);
    }
  }
  