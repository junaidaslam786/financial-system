import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { RoleEntity } from 'src/modules/roles/entities/role.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,

    @InjectRepository(RolePermission)
    private readonly rolePermissionRepo: Repository<RolePermission>,
  ) {}

  /**
   * Create a new permission by name + optional description
   */
  async createPermission(name: string, description?: string): Promise<Permission> {
    const existing = await this.permissionRepo.findOne({
      where: { permissionName: name },
    });
    if (existing) {
      throw new BadRequestException(`Permission '${name}' already exists`);
    }
    const perm = this.permissionRepo.create({
      permissionName: name,
      description: description || '',
    });
    return this.permissionRepo.save(perm);
  }

  /**
   * Update an existing permission's name or description
   */
  async updatePermission(
    permissionId: string,
    updates: Partial<Permission>,
  ): Promise<Permission> {
    const perm = await this.permissionRepo.findOne({ where: { id: permissionId } });
    if (!perm) {
      throw new NotFoundException(`Permission with ID ${permissionId} not found`);
    }

    // If updating permissionName, ensure it’s not a duplicate
    if (updates.permissionName && updates.permissionName !== perm.permissionName) {
      const dupCheck = await this.permissionRepo.findOne({
        where: {
          permissionName: updates.permissionName,
          id: Not(perm.id),
        },
      });
      if (dupCheck) {
        throw new BadRequestException(
          `Permission name '${updates.permissionName}' already exists`,
        );
      }
    }

    Object.assign(perm, updates);
    return this.permissionRepo.save(perm);
  }

  /**
   * Remove a permission entirely
   */
  async deletePermission(permissionId: string): Promise<void> {
    const perm = await this.permissionRepo.findOne({ where: { id: permissionId } });
    if (!perm) {
      throw new NotFoundException(`Permission with ID ${permissionId} not found`);
    }
    await this.permissionRepo.remove(perm);
  }

  /**
   * Find all permissions
   */
  async findAll(): Promise<Permission[]> {
    return this.permissionRepo.find({
      order: { permissionName: 'ASC' },
    });
  }

  /**
   * Find a permission by ID
   */
  async findById(id: string): Promise<Permission> {
    return this.permissionRepo.findOne({ where: { id } });
  }

  /**
   * Find a permission by name
   */
  async findByName(name: string): Promise<Permission> {
    return this.permissionRepo.findOne({ where: { permissionName: name } });
  }

  /**
   * Return all permissions that match any of the provided names
   */
  async findByNames(names: string[]): Promise<Permission[]> {
    if (!names || names.length === 0) return [];
    return this.permissionRepo.find({ where: { permissionName: In(names) } });
  }

  // ---------------------------------------------------------------------------
  // ROLE-PERMISSION ASSIGNMENT
  // ---------------------------------------------------------------------------

  /**
   * Assign multiple permissions by name to a given role.
   * If any permission doesn’t exist, optionally auto-create or throw an error.
   */
  async assignPermissionsToRole(role: RoleEntity, permissionNames: string[]): Promise<void> {
    // 1) Find all permissions that exist
    const existingPerms = await this.findByNames(permissionNames);

    // 2) For any missing permission name, either:
    //    - auto-create it, OR
    //    - throw an error. (Here we auto-create for demonstration.)
    const existingNames = existingPerms.map((p) => p.permissionName);
    const missingNames = permissionNames.filter((n) => !existingNames.includes(n));
    for (const missing of missingNames) {
      const newlyCreated = await this.createPermission(missing);
      existingPerms.push(newlyCreated);
    }

    // 3) Create role_permissions entries
    const newRolePerms: RolePermission[] = [];
    for (const perm of existingPerms) {
      // check if role already has it
      const rpExists = await this.rolePermissionRepo.findOne({
        where: { role: { id: role.id }, permission: { id: perm.id } },
      });
      if (!rpExists) {
        newRolePerms.push(
          this.rolePermissionRepo.create({
            role,
            permission: perm,
          }),
        );
      }
    }
    await this.rolePermissionRepo.save(newRolePerms);
  }

  /**
   * Unassign (remove) a set of permissions (by name) from a role
   */
  async unassignPermissionsFromRole(role: RoleEntity, permissionNames: string[]): Promise<void> {
    // find all perms
    const perms = await this.findByNames(permissionNames);
    if (!perms.length) return; // nothing to remove

    const permIds = perms.map((p) => p.id);
    await this.rolePermissionRepo
      .createQueryBuilder()
      .delete()
      .where('role_id = :roleId', { roleId: role.id })
      .andWhere('permission_id IN (:...permIds)', { permIds })
      .execute();
  }

  /**
   * Assign ALL known permissions to the given role
   */
  async assignAllPermissionsToRole(role: RoleEntity): Promise<void> {
    const allPermissions = await this.findAll();
    // Similar logic as above – we only insert missing ones
    const newRolePerms: RolePermission[] = [];
    for (const perm of allPermissions) {
      const rpExists = await this.rolePermissionRepo.findOne({
        where: { role: { id: role.id }, permission: { id: perm.id } },
      });
      if (!rpExists) {
        newRolePerms.push(
          this.rolePermissionRepo.create({
            role,
            permission: perm,
          }),
        );
      }
    }
    await this.rolePermissionRepo.save(newRolePerms);
  }

  /**
   * Replace the role’s permissions entirely (remove old ones, insert new ones).
   */
  async replacePermissionsForRole(role: RoleEntity, newPermissionNames: string[]): Promise<void> {
    // 1) Unassign everything first
    await this.rolePermissionRepo.delete({ role: { id: role.id } });
    // 2) Then assign the new set
    await this.assignPermissionsToRole(role, newPermissionNames);
  }

  /**
   * Return the permissions assigned to a specific role
   */
  async getPermissionsOfRole(role: RoleEntity): Promise<Permission[]> {
    // or you can just do: 
    //   return this.permissionRepo.find({
    //     where: { rolePermissions: { role: {id: role.id} } },
    //     relations: ['rolePermissions'],
    //   });
    const rps = await this.rolePermissionRepo.find({
      where: { role: { id: role.id } },
      relations: ['permission'],
    });
    return rps.map((rp) => rp.permission);
  }

  /**
   * Check if a role has a specific permission name
   */
  async roleHasPermission(role: RoleEntity, permissionName: string): Promise<boolean> {
    const permission = await this.findByName(permissionName);
    if (!permission) return false;
    const rp = await this.rolePermissionRepo.findOne({
      where: {
        role: { id: role.id },
        permission: { id: permission.id },
      },
    });
    return !!rp;
  }
}
