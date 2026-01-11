
/**
 * RolesGuard
 * Checks user roles against @Roles metadata
 */
export class RolesGuard {
  canActivate(req: any, roles: string[]) {
    return roles?.includes(req.headers['x-role']);
  }
}
