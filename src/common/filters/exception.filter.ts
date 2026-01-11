
/**
 * Global Exception Filter
 */
export function exceptionFilter(err: any, req: any, res: any, next: any) {
  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }
  res.status(500).json({ message: err.message || 'Internal error' });
}
