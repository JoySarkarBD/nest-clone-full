
/**
 * @UseInterceptors()
 * Attaches interceptors to route
 */
export function UseInterceptors(...ints: any[]): MethodDecorator {
  return (t, k) =>
    Reflect.defineMetadata('interceptors', ints, t, k);
}
