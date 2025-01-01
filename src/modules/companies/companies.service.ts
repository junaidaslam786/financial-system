import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto, UpdateCompanyDto } from './dtos';
import { UsersService } from '../users/users.service';
import { CompanyOwnersService } from '../company-owners/company-owners.service';
import { Role } from '../auth/interfaces/role.enum';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    private readonly usersService: UsersService,
    private readonly companyOwnersService: CompanyOwnersService,
  ) {}

  /**
   * Create a new company, linking it to the user as the admin/owner
   */
  async createCompany(userId: string, dto: CreateCompanyDto) {
    // 1) Make sure user is "owner" or "admin"
    const user = await this.usersService.findById(userId);
    if (!user.role) {
      throw new ForbiddenException('No role assigned');
    }
    const userRoleName = user.role.roleName; // e.g. 'owner', 'admin', 'user'
    if (userRoleName !== 'owner' && userRoleName !== 'admin') {
      throw new ForbiddenException(
        'Only owners or admins can create companies.',
      );
    }

    // 2) Check the 5 companies limit
    const existingCount = await this.countUserCompanies(userId);
    if (existingCount >= 5) {
      throw new ForbiddenException(
        'You already have 5 companies, the maximum allowed.',
      );
    }

    // 3) Create the company
    const company = this.companyRepo.create({
      ...dto,
      createdByUserId: userId,
    });
    const savedCompany = await this.companyRepo.save(company);

    // 4) Also create a record in `company_owners` to reflect that user is an owner
    await this.companyOwnersService.createOwner({
      companyId: savedCompany.id,
      ownerName: user.username,
      contactInfo: user.email,
      ownershipPercentage: 100, // If you want to default to full ownership
    });

    return savedCompany;
  }

  async findAllCompanies(userId: string) {
    // Optional check: verify user exists
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    // Check role permission (owner or admin) if needed
    if (user.role.roleName !== 'owner' && user.role.roleName !== 'admin') {
      throw new ForbiddenException(
        'You do not have permission to view companies.',
      );
    }

    // Return companies created by that user
    // (Add pagination logic, relations, etc. as desired)
    return this.companyRepo.find({
      where: { createdByUserId: userId },
      relations: [
        'companyOwners',
        // ... other relations ...
      ],
    });
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
    const defaultCompany = this.companyRepo.create({
      name: 'Default Company',
      createdByUserId: userId,
    });
    const savedCompany = await this.companyRepo.save(defaultCompany);

    // Also create a `company_owners` record
    const user = await this.usersService.findById(userId);
    await this.companyOwnersService.createOwner({
      companyId: savedCompany.id,
      ownerName: user.username,
      contactInfo: user.email,
      ownershipPercentage: 100,
    });

    user.defaultCompanyId = savedCompany.id;
    await this.usersService.saveUser(user);

    return savedCompany;
  }
}
