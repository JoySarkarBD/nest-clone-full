
/**
 * AuthGuard
 * Simple authentication example
 */
export class AuthGuard {
  canActivate(req: any) {
    return !!req.headers.authorization;
  }
}
