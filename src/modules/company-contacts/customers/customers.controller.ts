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
  import { CustomersService } from './customers.service';
  import { CreateCustomerDto } from './dtos/create-customer.dto';
  import { UpdateCustomerDto } from './dtos/update-customer.dto';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
  import { RolesGuard } from 'src/common/guards/roles.guard';
  import { Roles } from 'src/common/decorators/roles.decorator';
  import { Role } from 'src/modules/auth/interfaces/role.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';
  
  @ApiTags('Customers')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Controller('customers')
  @Roles(Role.Owner, Role.Admin)
  export class CustomersController {
    constructor(private readonly customersService: CustomersService) {}
  
    
    @Post()
    @Permissions(PERMISSIONS.CUSTOMERS.CREATE)
    async create(@Body() dto: CreateCustomerDto) {
      return this.customersService.create(dto);
    }
  
    @Get('company/:companyId')
    @Permissions(PERMISSIONS.CUSTOMERS.READ)
    async findAll(@Param('companyId', ParseUUIDPipe) companyId: string) {
      if (!companyId) {
        throw new BadRequestException('companyId param is required');
      }
      return this.customersService.findAll(companyId);
    }
  
    @Get(':id')
    @Permissions(PERMISSIONS.CUSTOMERS.READ)
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.customersService.findOne(id);
    }
  
    
    @Patch(':id')
    @Permissions(PERMISSIONS.CUSTOMERS.UPDATE)
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCustomerDto) {
      return this.customersService.update(id, dto);
    }
  
    
    @Delete(':id')
    @Permissions(PERMISSIONS.CUSTOMERS.DELETE)
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.customersService.remove(id);
    }
  }
  