
/**
 * @Module()
 * Groups providers, controllers, imports
 */
export interface ModuleMeta {
  controllers?: any[];
  providers?: any[];
  imports?: any[];
}

export function Module(meta: ModuleMeta): ClassDecorator {
  return (target) =>
    Reflect.defineMetadata('module:meta', meta, target);
}
