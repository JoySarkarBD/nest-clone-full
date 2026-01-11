/**
 * IoC Container (NestJS-style)
 * ---------------------------
 * - Resolves constructor dependencies
 * - Maintains singleton instances
 */
export class Container {
  private static instances = new Map<any, any>();

  static resolve<T>(cls: new (...args: any[]) => T): T {
    if (!this.instances.has(cls)) {
      const deps = (Reflect as any).getMetadata("design:paramtypes", cls) || [];
      const args = deps.map((d: any) => Container.resolve(d));
      this.instances.set(cls, new cls(...args));
    }
    return this.instances.get(cls);
  }
}
