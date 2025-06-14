import type * as zod from 'zod';

export function isZodErrorLike(err: unknown): err is zod.ZodError {
  return (
    err instanceof Error &&
    err.name === 'ZodError' &&
    'issues' in err &&
    Array.isArray(err.issues)
  );
}
