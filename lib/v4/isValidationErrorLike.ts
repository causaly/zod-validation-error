import {
  ZOD_VALIDATION_ERROR_NAME,
  type ValidationError,
} from './ValidationError.ts';

export function isValidationErrorLike(err: unknown): err is ValidationError {
  return err instanceof Error && err.name === ZOD_VALIDATION_ERROR_NAME;
}
