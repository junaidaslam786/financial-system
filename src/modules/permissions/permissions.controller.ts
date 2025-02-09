import { Controller, Post, Body, Get, BadRequestException, UseGuards, Param, Put, Patch, NotFoundException, Delete } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '../auth/interfaces/role.enum';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';
import { Permission } from './entities/permission.entity';
import { RoleEntity } from '../roles/entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@ApiBearerAuth()
@ApiTags('Permissions')
@Controller('permissions')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles(Role.Owner, Role.Admin)


export class PermissionsController {
  constructor(
    private readonly permService: PermissionsService,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

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

  @Get(':id')
  @Permissions(PERMISSIONS.PERMISSIONS.READ)
  async getPermissionById(@Param('id') id: string): Promise<Permission> {
    const permission = await this.permService.findById(id);
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
    return permission;
  }

  /**
   * Update a permission.
   * PATCH /permissions/:id
   */
  @Patch(':id')
  @Permissions(PERMISSIONS.PERMISSIONS.UPDATE)
  async updatePermission(
    @Param('id') id: string,
    @Body() updates: Partial<Permission>,
  ): Promise<Permission> {
    return this.permService.updatePermission(id, updates);
  }

  /**
   * Delete a permission.
   * DELETE /permissions/:id
   */
  @Delete(':id')
  @Permissions(PERMISSIONS.PERMISSIONS.DELETE)
  async deletePermission(@Param('id') id: string): Promise<void> {
    return this.permService.deletePermission(id);
  }

  // ============================================================================
  // ROLE-PERMISSION ASSIGNMENT ENDPOINTS
  // ============================================================================

  /**
   * Helper method to look up a RoleEntity by its ID.
   */
  private async findRoleById(roleId: string): Promise<RoleEntity> {
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }
    return role;
  }

  /**
   * Assign a set of permissions (by name) to a role.
   * POST /permissions/role/:roleId/assign
   */
  @Post('role/:roleId/assign')
  @Permissions(PERMISSIONS.PERMISSIONS.ASSIGN)
  async assignPermissionsToRole(
    @Param('roleId') roleId: string,
    @Body() body: { permissionNames: string[] },
  ): Promise<void> {
    const role = await this.findRoleById(roleId);
    if (!body.permissionNames || body.permissionNames.length === 0) {
      throw new BadRequestException('At least one permission name is required');
    }
    await this.permService.assignPermissionsToRole(role, body.permissionNames);
  }

  /**
   * Unassign (remove) a set of permissions (by name) from a role.
   * POST /permissions/role/:roleId/unassign
   */
  @Post('role/:roleId/unassign')
  @Permissions(PERMISSIONS.PERMISSIONS.UNASSIGN)
  async unassignPermissionsFromRole(
    @Param('roleId') roleId: string,
    @Body() body: { permissionNames: string[] },
  ): Promise<void> {
    const role = await this.findRoleById(roleId);
    if (!body.permissionNames || body.permissionNames.length === 0) {
      throw new BadRequestException('At least one permission name is required');
    }
    await this.permService.unassignPermissionsFromRole(role, body.permissionNames);
  }

  /**
   * Assign all available permissions to a role.
   * POST /permissions/role/:roleId/assign-all
   */
  @Post('role/:roleId/assign-all')
  @Permissions(PERMISSIONS.PERMISSIONS.ASSIGN_ALL)
  async assignAllPermissionsToRole(@Param('roleId') roleId: string): Promise<void> {
    const role = await this.findRoleById(roleId);
    await this.permService.assignAllPermissionsToRole(role);
  }

  /**
   * Replace a role’s permissions entirely with a new set.
   * PUT /permissions/role/:roleId/replace
   */
  @Put('role/:roleId/replace')
  @Permissions(PERMISSIONS.PERMISSIONS.REPLACE)
  async replacePermissionsForRole(
    @Param('roleId') roleId: string,
    @Body() body: { permissionNames: string[] },
  ): Promise<void> {
    const role = await this.findRoleById(roleId);
    if (!body.permissionNames) {
      throw new BadRequestException('Permission names are required for replacement');
    }
    await this.permService.replacePermissionsForRole(role, body.permissionNames);
  }

  /**
   * Get all permissions assigned to a role.
   * GET /permissions/role/:roleId
   */
  @Get('role/:roleId')
  @Permissions(PERMISSIONS.PERMISSIONS.READ)
  async getPermissionsOfRole(@Param('roleId') roleId: string): Promise<Permission[]> {
    const role = await this.findRoleById(roleId);
    return this.permService.getPermissionsOfRole(role);
  }

  /**
   * Check if a role has a specific permission.
   * GET /permissions/role/:roleId/has/:permissionName
   */
  @Get('role/:roleId/has/:permissionName')
  @Permissions(PERMISSIONS.PERMISSIONS.READ)
  async roleHasPermission(
    @Param('roleId') roleId: string,
    @Param('permissionName') permissionName: string,
  ): Promise<{ hasPermission: boolean }> {
    const role = await this.findRoleById(roleId);
    const hasPermission = await this.permService.roleHasPermission(role, permissionName);
    return { hasPermission };
  }

}