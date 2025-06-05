import type * as zod from 'zod/v4/core';

export function isZodErrorLike(err: unknown): err is zod.$ZodError {
  return (
    err instanceof Object &&
    'name' in err &&
    (err.name === 'ZodError' || err.name === '$ZodError') &&
    'issues' in err &&
    Array.isArray(err.issues)
  );
}
