/**
 * @Body()
 * DTO transformation + validation pipe
 */
export function Body(dto: any): ParameterDecorator {
  return (target, key, index) => {
    (Reflect as any).defineMetadata(
      `param:${index}`,
      { type: "body", dto },
      target,
      key
    );
  };
}
