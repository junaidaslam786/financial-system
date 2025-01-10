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
  
  @ApiTags('Suppliers')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('suppliers')
  export class SuppliersController {
    constructor(private readonly suppliersService: SuppliersService) {}
  
    /**
     * Only "owner" or "admin" can create a supplier
     */
    @Roles(Role.Owner, Role.Admin)
    @Post()
    async create(@Body() dto: CreateSupplierDto) {
      return this.suppliersService.create(dto);
    }
  
    /**
     * List all suppliers
     */
    @Get('company/:companyId')
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
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.suppliersService.findOne(id);
    }
  
    /**
     * Update supplier
     */
    @Roles(Role.Owner, Role.Admin)
    @Patch(':id')
    async update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() dto: UpdateSupplierDto,
    ) {
      return this.suppliersService.update(id, dto);
    }
  
    /**
     * Delete supplier
     */
    @Roles(Role.Owner, Role.Admin)
    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.suppliersService.remove(id);
    }
  }
  