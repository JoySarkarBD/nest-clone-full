import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Container } from "./container";

/**
 * Router Explorer
 * ----------------
 * Binds controllers, guards, interceptors, params
 */
export function registerControllers(app: any, controllers: any[]) {
  controllers.forEach((Ctrl) => {
    const instance = Container.resolve(Ctrl) as any;
    const prefix =
      (Reflect as any).getMetadata("controller:prefix", Ctrl) || "";
    const routes =
      (Reflect as any).getMetadata("controller:routes", Ctrl) || [];

    routes.forEach((r: any) => {
      app[r.method](prefix + r.path, async (req: any, res: any, next: any) => {
        try {
          const guards =
            (Reflect as any).getMetadata("guards", instance, r.handler) || [];
          for (const g of guards) {
            if (!(Container.resolve(g) as any).canActivate(req)) {
              return res.status(403).json({ message: "Forbidden" });
            }
          }

          const paramMeta: Array<{ index: number; meta: any }> = (
            Reflect as any
          )
            .getMetadataKeys(instance, r.handler)
            .filter((k: any) => String(k).startsWith("param:"))
            .map((k: any) => ({
              index: Number(String(k).split(":")[1]),
              meta: (Reflect as any).getMetadata(k, instance, r.handler) as any,
            }));

          const args: any[] = [];
          for (const p of paramMeta) {
            if (p.meta === "req") args[p.index] = req;
            else if (p.meta === "res") args[p.index] = res;
            else if (p.meta.type === "body") {
              const dto = plainToInstance(p.meta.dto, req.body);
              const errors = await validate(dto);
              if (errors.length) throw errors;
              args[p.index] = dto;
            } else if (p.meta.type === "param")
              args[p.index] = p.meta.name
                ? req.params[p.meta.name]
                : req.params;
            else if (p.meta.type === "query")
              args[p.index] = p.meta.name ? req.query[p.meta.name] : req.query;
          }

          let result = await instance[r.handler](...args);

          const interceptors =
            (Reflect as any).getMetadata("interceptors", instance, r.handler) ||
            [];
          for (const i of interceptors) {
            result = await (Container.resolve(i) as any).intercept(
              () => result
            );
          }

          if (!res.headersSent) res.json(result);
        } catch (e) {
          next(e);
        }
      });
    });
  });
}
