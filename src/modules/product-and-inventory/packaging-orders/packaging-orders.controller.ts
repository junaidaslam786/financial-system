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
  
  @ApiTags('Packaging Orders')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('packaging-orders')
  export class PackagingOrdersController {
    constructor(private readonly pkgOrdersService: PackagingOrdersService) {}
  
    @ApiOperation({ summary: 'Create a new packaging order' })
    @Roles(Role.Owner, Role.Admin)
    @Post()
    async create(@Body() dto: CreatePackagingOrderDto) {
      return this.pkgOrdersService.create(dto);
    }
  
    @ApiOperation({ summary: 'Get all packaging orders for a company' })
    @Get()
    async findAll(@Query('companyId', ParseUUIDPipe) companyId: string) {
      return this.pkgOrdersService.findAllByCompanyId(companyId);
    }
  
    @ApiOperation({ summary: 'Get a single packaging order by ID' })
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.pkgOrdersService.findOne(id);
    }
  
    @ApiOperation({ summary: 'Update a packaging order' })
    @Roles(Role.Owner, Role.Admin)
    @Patch(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePackagingOrderDto) {
      return this.pkgOrdersService.update(id, dto);
    }
  
    @ApiOperation({ summary: 'Delete a packaging order' })
    @Roles(Role.Owner, Role.Admin)
    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.pkgOrdersService.remove(id);
    }
  }
  