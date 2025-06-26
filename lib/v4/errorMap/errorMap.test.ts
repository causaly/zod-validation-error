import * as zod from 'zod/v4';
import { vi } from 'vitest';
import { createErrorMap, isZodValidationErrorMap } from './errorMap.ts';

describe('zod', () => {
  test('does NOT provide issue.input on error', () => {
    const schema = zod.object({
      input: zod.string(),
    });

    const result = schema.safeParse({ input: 123 });
    if (result.success) {
      throw new Error('Expected failure');
    }

    expect(result.error.issues[0].input).toBeUndefined();
  });

  test('provides issue.input to errorMap', () => {
    const schema = zod.object({
      input: zod.string(),
    });

    const mockErrorMap = vi.fn(() => 'Mock error message');

    const result = schema.safeParse(
      { input: 123 },
      {
        error: mockErrorMap,
      }
    );
    if (result.success) {
      throw new Error('Expected failure');
    }

    expect(result.error.issues[0].input).toBeUndefined();
    expect(result.error.issues[0].message).toBe('Mock error message');
    expect(mockErrorMap).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        code: 'invalid_type',
        input: 123,
      })
    );
  });

  test('exposes globalConfig object with errorMap set to undefined by default', () => {
    expect(zod.core.globalConfig.customError).toBeUndefined();
  });

  test('overrides global config with custom errorMap', () => {
    const errorMap = createErrorMap({
      includePath: true,
    });
    zod.config({
      customError: errorMap,
    });
    expect(zod.core.globalConfig.customError).toBe(errorMap);
    expect(isZodValidationErrorMap(zod.core.globalConfig.customError)).toBe(
      true
    );
  });
});
