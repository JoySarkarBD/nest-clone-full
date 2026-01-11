
/**
 * LoggingInterceptor
 * Logs execution time
 */
export class LoggingInterceptor {
  async intercept(next: Function) {
    const start = Date.now();
    const res = await next();
    console.log('Execution time:', Date.now() - start);
    return res;
  }
}
