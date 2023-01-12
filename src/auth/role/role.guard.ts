import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  matchRoles(roles: string[], userRole: string) {
    console.log("roles: ",roles);
    console.log("userRole: ",userRole);
    return roles.some((role) => role === userRole);
  }
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log("role guard roles: ",roles);
    
    if (!roles) {
      return true;
    }
    const request=context.switchToHttp().getRequest();
    const user=request.user;
    console.log("role guard user: ",user);
    
    return this.matchRoles(roles,user.role);
  }
}
