import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );


    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No permissions required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    // Map `id` to `sub` if necessary
    if (!user.sub && user.id) {
      user.sub = user.id;
    }

    if (!user || !user.sub) {
      throw new ForbiddenException('No user found in request');
    }

    // Fetch user with permissions
    const dbUser = await this.usersService.findByIdWithRolePermissions(user.sub);
    if (!dbUser) {
      throw new ForbiddenException('User not found in database');
    }


    if (!dbUser?.role) {
      throw new ForbiddenException('User has no role assigned');
    }

    const userPermissions =
      dbUser.role.rolePermissions?.map((rp) => rp.permission.permissionName) ||
      [];

    const missing = requiredPermissions.filter(
      (rp) => !userPermissions.includes(rp),
    );
    if (missing.length > 0) {
      throw new ForbiddenException(
        `Missing permissions: ${missing.join(', ')}`,
      );
    }

    return true;
  }
}

