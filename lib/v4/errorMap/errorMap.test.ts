import * as zod from 'zod/v4';
import { vi } from 'vitest';
import {
  createErrorMap,
  defaultErrorMap,
  defaultErrorMapOptions,
} from './errorMap.ts';

describe('errorMap', () => {
  test('returns defaultErrorMap when no options are passed', () => {
    const errorMap = createErrorMap();
    expect(errorMap).toBe(defaultErrorMap);
  });

  test('returns defaultErrorMap when options partially match the default options', () => {
    const errorMap = createErrorMap({
      includePath: defaultErrorMapOptions.includePath,
      issuesInTitleCase: defaultErrorMapOptions.issuesInTitleCase,
    });
    expect(errorMap).toBe(defaultErrorMap);
  });

  test('returns defaultErrorMap when options fully match the default options', () => {
    const errorMap = createErrorMap(defaultErrorMapOptions);
    expect(errorMap).toBe(defaultErrorMap);
  });

  test('does NOT return defaultErrorMap when options diverge from the default options', () => {
    const errorMap = createErrorMap({
      ...defaultErrorMapOptions,
      includePath: false,
    });
    expect(errorMap).not.toBe(defaultErrorMap);
  });
});

describe('zod', () => {
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

  test('exposes globalConfig object with errorMap set to undefined by default', () => {
    expect(zod.core.globalConfig.customError).toBeUndefined();
  });

  test('overrides global config with custom errorMap', () => {
    const errorMap = createErrorMap();
    zod.config({
      customError: errorMap,
    });
    expect(zod.core.globalConfig.customError).toBe(defaultErrorMap);
  });
});
