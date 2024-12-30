// employees.controller.ts
import { Controller, Post, Get, Patch, Delete, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dtos';
import { EmployeeEntity } from './entities/employee.entity';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  async create(@Body() dto: CreateEmployeeDto) {
    return this.employeesService.createEmployee(dto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesService.findOneEmployee(id);
  }

  @Get('company/:companyId')
  async getEmployeesByCompanyId(
    @Param('companyId') companyId: string,
  ): Promise<EmployeeEntity[]> {
    return this.employeesService.findAllEmployeesByCompanyId(companyId);
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateEmployeeDto) {
    return this.employeesService.updateEmployee(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesService.removeEmployee(id);
  }
}
