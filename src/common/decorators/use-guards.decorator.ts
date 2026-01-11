
/**
 * @UseGuards()
 * Attaches guard metadata to handler
 */
export function UseGuards(...guards: any[]): MethodDecorator {
  return (t, k) =>
    Reflect.defineMetadata('guards', guards, t, k);
}
