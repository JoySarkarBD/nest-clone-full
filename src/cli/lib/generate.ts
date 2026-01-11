import * as fs from "fs";
import path = require("path");

function toPascal(s: string) {
  return s
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join("");
}

/**
 * Generator engine
 */
export function generate(cmd: string, type: string, name: string) {
  if (cmd !== "g") {
    console.log('Only generate supported (use "g")');
    return;
  }

  const cwd = process.cwd();

  const ensure = (p: string) => fs.mkdirSync(p, { recursive: true });

  function updateAppModule(modName: string) {
    try {
      const appPath = path.join(cwd, "src", "app.module.ts");
      if (!fs.existsSync(appPath)) return;
      let app = fs.readFileSync(appPath, "utf8");
      const pascal = toPascal(modName);
      const importLine = `import { ${pascal}Module } from './modules/${modName}/${modName}.module';`;
      if (!app.includes(importLine)) {
        const lines = app.split(/\r?\n/);
        let lastImport = 0;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim().startsWith("import ")) lastImport = i;
        }
        lines.splice(lastImport + 1, 0, importLine);
        app = lines.join("\n");
      }

      const importsRegex = /imports\s*:\s*\[([\s\S]*?)\]/m;
      const match = app.match(importsRegex);
      if (match) {
        const inner = match[1];
        if (!inner.includes(`${pascal}Module`)) {
          const newInner =
            inner.trim() === ""
              ? `${pascal}Module`
              : `${inner.trim()}, ${pascal}Module`;
          app = app.replace(importsRegex, `imports: [${newInner}]`);
        }
      }

      fs.writeFileSync(appPath, app, "utf8");
      console.log("✔ Updated AppModule imports with", `${pascal}Module`);
    } catch (e: any) {
      console.warn("Could not update AppModule:", e.message || e);
    }
  }

  if (type === "module") {
    const base = path.join(cwd, "src", "modules", name);
    ensure(base);
    const className = `${toPascal(name)}Module`;
    const content = `import { Module } from '../../common/decorators/module.decorator';\nimport { ${toPascal(
      name
    )}Controller } from './${name}.controller';\nimport { ${toPascal(
      name
    )}Service } from './${name}.service';\n\n@Module({\n  controllers: [${toPascal(
      name
    )}Controller],\n  providers: [${toPascal(
      name
    )}Service],\n})\nexport class ${className} {}\n`;
    fs.writeFileSync(path.join(base, `${name}.module.ts`), content);
    console.log("✔ Generated module", name);
    updateAppModule(name);
    return;
  }

  if (type === "controller") {
    const base = path.join(cwd, "src", "modules", name);
    ensure(base);
    const className = `${toPascal(name)}Controller`;
    const serviceName = `${toPascal(name)}Service`;
    const content = `import { Controller } from '../../common/decorators/controller.decorator';\nimport { Get, Post } from '../../common/decorators/route.decorator';\nimport { Param } from '../../common/decorators/param.decorator';\nimport { Body } from '../../common/decorators/body.decorator';\nimport { ${serviceName} } from './${name}.service';\n\n@Controller('/${name}s')\nexport class ${className} {\n  constructor(private service: ${serviceName}) {}\n\n  @Get('/')\n  find() {\n    return this.service.findAll();\n  }\n\n  @Post('/')\n  create(@Body(Object) dto: any) {\n    return dto;\n  }\n}\n`;
    fs.writeFileSync(path.join(base, `${name}.controller.ts`), content);
    console.log("✔ Generated controller", name);
    return;
  }

  if (type === "service") {
    const base = path.join(cwd, "src", "modules", name);
    ensure(base);
    const className = `${toPascal(name)}Service`;
    const content = `import { Injectable } from '../../common/decorators/injectable.decorator';\n\n@Injectable()\nexport class ${className} {\n  findAll() {\n    return [];\n  }\n}\n`;
    fs.writeFileSync(path.join(base, `${name}.service.ts`), content);
    console.log("✔ Generated service", name);
    return;
  }

  if (type === "dto") {
    // support names like `create-user` -> create DTO in modules/user/dto/create-user.dto.ts
    if (name.includes("-")) {
      const parts = name.split("-");
      const module = parts[parts.length - 1];
      const dtoBase = parts.slice(0, parts.length - 1).join("-");
      function updateAppModule(modName: string) {
        try {
          const appPath = path.join(cwd, "src", "app.module.ts");
          if (!fs.existsSync(appPath)) return;
          let app = fs.readFileSync(appPath, "utf8");
          const pascal = toPascal(modName);
          const importLine = `import { ${pascal}Module } from './modules/${modName}/${modName}.module';`;
          if (!app.includes(importLine)) {
            const lines = app.split(/\r?\n/);
            let lastImport = 0;
            for (let i = 0; i < lines.length; i++) {
              if (lines[i].trim().startsWith("import ")) lastImport = i;
            }
            lines.splice(lastImport + 1, 0, importLine);
            app = lines.join("\n");
          }

          const importsRegex = /imports\s*:\s*\[([\s\S]*?)\]/m;
          const match = app.match(importsRegex);
          if (match) {
            const inner = match[1];
            if (!inner.includes(`${pascal}Module`)) {
              const newInner =
                inner.trim() === ""
                  ? `${pascal}Module`
                  : `${inner.trim()}, ${pascal}Module`;
              app = app.replace(importsRegex, `imports: [${newInner}]`);
            }
          }

          fs.writeFileSync(appPath, app, "utf8");
          console.log("✔ Updated AppModule imports with", `${pascal}Module`);
        } catch (e: any) {
          console.warn("Could not update AppModule:", e.message || e);
        }
      }
      const base = path.join(cwd, "src", "modules", module, "dto");
      ensure(base);
      const className = `${toPascal(dtoBase)}${toPascal(module)}Dto`;
      const fileName = `${dtoBase}-${module}.dto.ts`;
      const content = `export class ${className} {\n  // add properties here\n}\n`;
      fs.writeFileSync(path.join(base, fileName), content);
      console.log("✔ Generated dto", fileName);
      return;
    }

    // otherwise create under common/dto
    const base = path.join(cwd, "src", "common", "dto");
    ensure(base);
    const className = `${toPascal(name)}Dto`;
    const fileName = `${name}.dto.ts`;
    const content = `export class ${className} {\n  // add properties here\n}\n`;
    fs.writeFileSync(path.join(base, fileName), content);
    console.log("✔ Generated dto", fileName);
    return;
  }

  if (type === "resource") {
    // create module + controller + service + basic dto
    generate("g", "module", name);
    generate("g", "controller", name);
    generate("g", "service", name);
    generate("g", "dto", `create-${name}`);
    // ensure app module updated
    updateAppModule(name);
    console.log("✔ Generated resource", name);
    return;
  }
  console.log("Unknown generate type:", type);
}
