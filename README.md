# Nest-Clone-Full

A compact, educational NestJS-like framework implemented in TypeScript. This project demonstrates core Nest concepts (IoC container, decorators, routing, guards, interceptors, DTO validation) and includes a small CLI to scaffold modules and resources.

[![typescript](https://img.shields.io/badge/typescript-5.9-blue?style=flat)](https://www.typescriptlang.org/)

## Table of contents

- [Overview](#overview)
- [Quick start](#quick-start)
- [CLI usage](#cli-usage)
- [Generator templates](#generator-templates)
- [Project layout](#project-layout)
- [How it works](#how-it-works)
- [Tips & troubleshooting](#tips--troubleshooting)
- [Extending the CLI](#extending-the-cli)
- [Contributing](#contributing)

## Overview

This repository is an intentionally small, readable implementation of several Nest-like features:

- IoC container for resolving constructor dependencies
- Decorators: `@Module`, `@Controller`, route decorators (`@Get`, `@Post`, ...), param decorators
- Express-based router that maps controller metadata to routes
- Support for DTO transformation + validation using `class-transformer` and `class-validator`
- A CLI to scaffold modules, controllers, services and DTOs and to automatically add modules to `AppModule`

It is designed for learning and rapid prototyping rather than production use.

## Quick start

Install dependencies:

```bash
npm install
```

Run the app in development (watch + restart):

```bash
npm run dev
```

Run the CLI:

```bash
npm run cli -- g module user
# or simply
npm run cli g module user
```

## CLI usage

Supported generator commands:

- `npm run cli g module <name>` — create `src/modules/<name>/<name>.module.ts` and add to `AppModule`
- `npm run cli g controller <name>` — create `src/modules/<name>/<name>.controller.ts`
- `npm run cli g service <name>` — create `src/modules/<name>/<name>.service.ts`
- `npm run cli g dto <name>` — create a DTO. For names like `create-user` a DTO will be placed in `src/modules/user/dto/`.
- `npm run cli g resource <name>` — convenience: generates module, controller, service and a DTO and updates `AppModule`

Examples:

```bash
npm run cli g module auth
npm run cli g controller auth
npm run cli g service auth
npm run cli g dto create-user
npm run cli g resource billing
```

## Generator templates

Templates are implemented in `src/cli/lib/generate.ts` as template strings. Customize that file to change the generated boilerplate (add tests, example routes, validation, or README snippets inside generated modules).

## Project layout

```
src/
  app.module.ts            # Root application module (AppModule)
  main.ts                  # App bootstrap
  core/                    # framework internals (container, router, bootstrap)
  common/                  # decorators, guards, interceptors, filters, utilities
  modules/                 # generated application modules
  cli/                     # CLI implementation
    lib/generate.ts        # generator engine and templates
    index.ts               # CLI entrypoint
```

## How it works

- Decorators store metadata using `Reflect.defineMetadata`; the router reads metadata with `Reflect.getMetadata` to register routes.
- `Container` resolves classes by reading `design:paramtypes` metadata and constructing dependencies.
- DTOs are created with `class-transformer` and validated with `class-validator` on route invocation.
- Guards and interceptors are executed by the router by reading metadata placed by decorators.

> Note: some places cast `Reflect` to `any` to avoid TypeScript type issues when the `reflect-metadata` typings are not present.

## Tips & troubleshooting

- Ensure `reflect-metadata` is installed and imported early (see `src/main.ts`).
- The project avoids `esModuleInterop` in `tsconfig` — you will see `import = require('path')` and `import * as fs from 'fs'` patterns.
- The CLI attempts idempotent edits of `src/app.module.ts` — it will avoid inserting duplicate imports.

## Extending the CLI

To add more generators (e.g., guards, pipes, interceptors, providers):

1. Edit `src/cli/lib/generate.ts` and add a new `if (type === 'guard')` block.
2. Use `ensure()` and `fs.writeFileSync()` to create files and directories.
3. Optionally update `updateAppModule()` to wire things up automatically into `AppModule` if needed.

## Contributing

Contributions are welcome. Ideas:

- Better DTO naming (e.g. `create-user` → `CreateUserDto` in `create-user.dto.ts`).
- Generator tests that validate file creation and content.
- Additional templates for guards/interceptors/pipes and test/spec files.

If you want, I can implement DTO name fixes or add tests — tell me which you prefer next.

---

_This improved README was added as `README.improved.md`. To replace the existing `README.md` with this version, I can overwrite it for you._
