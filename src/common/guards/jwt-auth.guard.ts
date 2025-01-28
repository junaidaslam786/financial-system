import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Run the default JWT auth guard logic
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    console.log('jwt user: ', user);
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user; // Attach user to the request
  }
}
