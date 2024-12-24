import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from './entities/company.entity';
import { CreateCompanyDto, UpdateCompanyDto } from './dtos';
import { UsersService } from '../users/users.service';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepo: Repository<CompanyEntity>,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Create a new company, linking it to the user as the admin/owner
   */
  async createCompany(userId: string, dto: CreateCompanyDto) {
    const user = await this.usersService.findById(userId);
    // Possibly check if user has permission or role to create companies

    const company = this.companyRepo.create({
      ...dto,
      createdByUserId: userId,
    });

    return this.companyRepo.save(company);
  }

  /**
   * For listing or pagination
   */
  async findAllCompanies() {
    return this.companyRepo.find();
  }

  async findOneCompany(id: string) {
    const company = await this.companyRepo.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async updateCompany(id: string, dto: UpdateCompanyDto) {
    const company = await this.findOneCompany(id);
    Object.assign(company, dto);
    return this.companyRepo.save(company);
  }

  async removeCompany(id: string) {
    const company = await this.findOneCompany(id);
    return this.companyRepo.remove(company);
  }

  /**
   * Count how many companies a given user has created
   */
  async countUserCompanies(userId: string): Promise<number> {
    return this.companyRepo.count({ where: { createdByUserId: userId } });
  }

  /**
   * Used internally when a user first registers
   */
  async createDefaultCompanyForUser(userId: string) {
    const company = this.companyRepo.create({
      name: 'Default Company',
      createdByUserId: userId,
    });
    return this.companyRepo.save(company);
  }
}
