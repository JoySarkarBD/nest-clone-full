/**
 * @Controller()
 * Defines an HTTP controller and route prefix
 */
export function Controller(prefix = ""): ClassDecorator {
  return (target) => {
    (Reflect as any).defineMetadata("controller:prefix", prefix, target);
  };
}
