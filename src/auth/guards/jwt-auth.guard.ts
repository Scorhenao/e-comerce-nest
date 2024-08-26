import { UnauthorizedException } from '@nestjs/common';
// src/guards/jwt-auth.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Puedes añadir lógica adicional aquí si es necesario
  canActivate(context: ExecutionContext): boolean {
    return super.canActivate(context) as boolean;
  }

  handleRequest(err, user, info: Error) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
