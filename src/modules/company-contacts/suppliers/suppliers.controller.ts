import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    ParseUUIDPipe,
    UseGuards,
    BadRequestException,
  } from '@nestjs/common';
  import { SuppliersService } from './suppliers.service';
  import { CreateSupplierDto } from './dtos/create-supplier.dto';
  import { UpdateSupplierDto } from './dtos/update-supplier.dto';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
  import { RolesGuard } from 'src/common/guards/roles.guard';
  import { Roles } from 'src/common/decorators/roles.decorator';
  import { Role } from 'src/modules/auth/interfaces/role.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';
  
  @ApiTags('Suppliers')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Controller('suppliers')
  @Roles(Role.Owner, Role.Admin)
  export class SuppliersController {
    constructor(private readonly suppliersService: SuppliersService) {}
  
    /**
     * Only "owner" or "admin" can create a supplier
     */
    
    @Post()
    @Permissions(PERMISSIONS.SUPPLIERS.CREATE)
    async create(@Body() dto: CreateSupplierDto) {
      return this.suppliersService.create(dto);
    }
  
    /**
     * List all suppliers
     */
    @Get('company/:companyId')
    @Permissions(PERMISSIONS.SUPPLIERS.READ)
    async findAll(@Param('companyId', ParseUUIDPipe) companyId: string) {
      if (!companyId) {
        throw new BadRequestException('companyId param is required');
      }
      return this.suppliersService.findAll(companyId);
    }
  
    /**
     * Get supplier by ID
     */
    @Get(':id')
    @Permissions(PERMISSIONS.SUPPLIERS.READ)
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.suppliersService.findOne(id);
    }
  
    /**
     * Update supplier
     */
    
    @Patch(':id')
    @Permissions(PERMISSIONS.SUPPLIERS.UPDATE)
    async update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() dto: UpdateSupplierDto,
    ) {
      return this.suppliersService.update(id, dto);
    }
  
    /**
     * Delete supplier
     */
    
    @Delete(':id')
    @Permissions(PERMISSIONS.SUPPLIERS.DELETE)
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.suppliersService.remove(id);
    }
  }
  