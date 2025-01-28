// employees.controller.ts
import { Controller, Post, Get, Patch, Delete, Param, Body, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dtos';
import { EmployeeEntity } from './entities/employee.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '../auth/interfaces/role.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';


@ApiBearerAuth()
@ApiTags('Employees')
@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard) 
@Roles(Role.Owner, Role.Admin)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @Permissions(PERMISSIONS.EMPLOYEES.CREATE)
  async create(@Body() dto: CreateEmployeeDto) {
    return this.employeesService.createEmployee(dto);
  }

  @Get(':id')
  @Permissions(PERMISSIONS.EMPLOYEES.READ)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesService.findOneEmployee(id);
  }

  @Get('company/:companyId')
  @Permissions(PERMISSIONS.EMPLOYEES.READ)
  async getEmployeesByCompanyId(
    @Param('companyId') companyId: string,
  ): Promise<EmployeeEntity[]> {
    return this.employeesService.findAllEmployeesByCompanyId(companyId);
  }

  @Patch(':id')
  @Permissions(PERMISSIONS.EMPLOYEES.UPDATE)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateEmployeeDto) {
    return this.employeesService.updateEmployee(id, dto);
  }

  @Delete(':id')
  @Permissions(PERMISSIONS.EMPLOYEES.DELETE)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesService.removeEmployee(id);
  }
}
