
/**
 * @Roles()
 * Role-based access metadata
 */
export function Roles(...roles: string[]): MethodDecorator {
  return (t, k) =>
    Reflect.defineMetadata('roles', roles, t, k);
}
