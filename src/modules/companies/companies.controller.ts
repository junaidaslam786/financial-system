import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dtos';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '../auth/interfaces/role.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
// Optional: if you use role-based guard
// import { RolesGuard } from '../../roles/guards/roles.guard';
// import { Roles } from '../../roles/decorators/roles.decorator';

@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Roles(Role.Admin, Role.Owner)
  async createCompany(@Req() req, @Body() createCompanyDto: CreateCompanyDto) {
    // The user object is attached by JWT strategy, e.g. req.user
    const user = req.user;

    // Example check: if user already has 5 companies, forbid more
    const totalCompanies = await this.companiesService.countUserCompanies(
      user.id,
    );
    if (totalCompanies >= 5) {
      throw new ForbiddenException(
        'You have reached the maximum number of companies (5).',
      );
    }

    return this.companiesService.createCompany(user.id, createCompanyDto);
  }

  @Get()
  async findAllCompanies(
    @CurrentUser() user: User,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    // user should now be your fully authenticated user entity
    return this.companiesService.findAllCompanies(user.id);
  }

  @Get(':id')
  async findOneCompany(@Param('id', ParseUUIDPipe) id: string) {
    return this.companiesService.findOneCompany(id);
  }

  @Patch(':id')
  // @Roles('admin')
  async updateCompany(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.updateCompany(id, updateCompanyDto);
  }

  @Delete(':id')
  // @Roles('admin')
  async removeCompany(@Param('id', ParseUUIDPipe) id: string) {
    return this.companiesService.removeCompany(id);
  }
}
