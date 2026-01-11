/**
 * HTTP Method decorators
 * Stores route metadata
 */
const ROUTES = "controller:routes";
type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

function method(m: HttpMethod) {
  return (path = ""): MethodDecorator =>
    (target, key) => {
      const routes =
        (Reflect as any).getMetadata(ROUTES, target.constructor) || [];
      routes.push({ method: m, path, handler: key });
      (Reflect as any).defineMetadata(ROUTES, routes, target.constructor);
    };
}

export const Get = method("get");
export const Post = method("post");
export const Put = method("put");
export const Patch = method("patch");
export const Delete = method("delete");
