import type { ValidationError } from './ValidationError.ts';

export function isValidationErrorLike(err: unknown): err is ValidationError {
  return err instanceof Error && err.name === 'ZodValidationError';
}
