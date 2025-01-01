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
} from '@nestjs/common';
import { CompanyOwnersService } from './company-owners.service';
import { CreateCompanyOwnerDto, UpdateCompanyOwnerDto } from './dtos';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '../auth/interfaces/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiBearerAuth()
@ApiTags('Company Owners')
@Controller('company-owners')
@UseGuards(JwtAuthGuard, RolesGuard) 
@Roles(Role.Owner, Role.Admin)
export class CompanyOwnersController {
  constructor(private readonly ownersService: CompanyOwnersService) {}

  @Post()
  async create(@Body() dto: CreateCompanyOwnerDto) {
    return this.ownersService.createOwner(dto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ownersService.findOneOwner(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCompanyOwnerDto,
  ) {
    return this.ownersService.updateOwner(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ownersService.removeOwner(id);
  }
}
