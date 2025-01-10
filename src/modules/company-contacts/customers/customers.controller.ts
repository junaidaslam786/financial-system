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
  
  @ApiTags('Customers')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('customers')
  export class CustomersController {
    constructor(private readonly customersService: CustomersService) {}
  
    @Roles(Role.Owner, Role.Admin)
    @Post()
    async create(@Body() dto: CreateCustomerDto) {
      return this.customersService.create(dto);
    }
  
    @Get('company/:companyId')
    async findAll(@Param('companyId', ParseUUIDPipe) companyId: string) {
      if (!companyId) {
        throw new BadRequestException('companyId param is required');
      }
      return this.customersService.findAll(companyId);
    }
  
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.customersService.findOne(id);
    }
  
    @Roles(Role.Owner, Role.Admin)
    @Patch(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCustomerDto) {
      return this.customersService.update(id, dto);
    }
  
    @Roles(Role.Owner, Role.Admin)
    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.customersService.remove(id);
    }
  }
  