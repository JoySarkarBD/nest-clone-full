import express = require("express");
import { registerControllers } from "./router";

/**
 * bootstrap()
 * NestFactory.create() equivalent
 */
export function bootstrap(AppModule: any) {
  const app = express();
  app.use(express.json());

  const meta = (Reflect as any).getMetadata("module:meta", AppModule);
  meta.imports?.forEach((m: any) => {
    const mm = (Reflect as any).getMetadata("module:meta", m);
    registerControllers(app, mm.controllers || []);
  });

  return app;
}
