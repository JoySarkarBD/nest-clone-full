/**
 * Parameter decorators
 * --------------------
 * @Req() @Res() @Param() @Query() @BodyParam()
 */
export function Req(): ParameterDecorator {
  return (t, k, i) =>
    (Reflect as any).defineMetadata(`param:${i}`, "req", t, k);
}

export function Res(): ParameterDecorator {
  return (t, k, i) =>
    (Reflect as any).defineMetadata(`param:${i}`, "res", t, k);
}

export function Param(name?: string): ParameterDecorator {
  return (t, k, i) =>
    (Reflect as any).defineMetadata(
      `param:${i}`,
      { type: "param", name },
      t,
      k
    );
}

export function Query(name?: string): ParameterDecorator {
  return (t, k, i) =>
    (Reflect as any).defineMetadata(
      `param:${i}`,
      { type: "query", name },
      t,
      k
    );
}
