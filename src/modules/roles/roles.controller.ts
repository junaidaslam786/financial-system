import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto } from './dtos';
import { JwtAuthGuard } from './../../common/guards/jwt-auth.guard';
import { RolesGuard } from './../../common/guards/roles.guard';
import { Roles } from './../../common/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '../auth/interfaces/role.enum';

@ApiBearerAuth()
@ApiTags('Roles')
@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Owner, Role.Admin)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * Create a new role
   * Typically restricted to "admin" or super-admin
   */
  
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }

  /**
   * List all roles
   * Possibly restricted to "admin"
   */
  @Roles(Role.Owner, Role.Admin)
  @Get()
  async findAll() {
    return this.rolesService.findAll();
  }

  /**
   * Get role by ID
   */
  
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.findById(id);
  }

  /**
   * Update role
   */
  
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.updateRole(id, updateRoleDto);
  }

  /**
   * Delete a role
   */
  
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.remove(id);
  }
}
