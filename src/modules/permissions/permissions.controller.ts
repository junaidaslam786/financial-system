import { Controller, Post, Body, Get, BadRequestException, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '../auth/interfaces/role.enum';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';

@ApiBearerAuth()
@ApiTags('Permissions')
@Controller('permissions')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles(Role.Owner, Role.Admin)
export class PermissionsController {
  constructor(private readonly permService: PermissionsService) {}

  @Post()
  @Permissions(PERMISSIONS.PERMISSIONS.CREATE)
  async createPermission(@Body() body: { name: string; description?: string }) {
    if (!body.name) {
      throw new BadRequestException('Permission name is required');
    }
    return this.permService.createPermission(body.name, body.description);
  }

  @Get()
  @Permissions(PERMISSIONS.PERMISSIONS.READ)
  async findAll() {
    return this.permService.findAll();
  }
}