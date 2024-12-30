// employees.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeEntity } from './entities/employee.entity';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dtos';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepo: Repository<EmployeeEntity>,
  ) {}

  async createEmployee(dto: CreateEmployeeDto) {
    const employee = this.employeeRepo.create(dto);
    return this.employeeRepo.save(employee);
  }

  async findOneEmployee(id: string) {
    const emp = await this.employeeRepo.findOne({ where: { id } });
    if (!emp) {
      throw new NotFoundException('Employee not found');
    }
    return emp;
  }

  async findAllEmployeesByCompanyId(companyId: string): Promise<EmployeeEntity[]> {
    // (Optional) If you want to verify the company actually exists, you could do:
    // const companyExists = await this.companyRepo.findOne({ where: { id: companyId } });
    // if (!companyExists) {
    //   throw new NotFoundException(`Company with ID "${companyId}" not found`);
    // }
    return this.employeeRepo.find({
      where: {
        company: {
          id: companyId,
        },
      },
    });
  }
  

  async updateEmployee(id: string, dto: UpdateEmployeeDto) {
    const emp = await this.findOneEmployee(id);
    Object.assign(emp, dto);
    return this.employeeRepo.save(emp);
  }

  async removeEmployee(id: string) {
    const emp = await this.findOneEmployee(id);
    return this.employeeRepo.remove(emp);
  }
}
