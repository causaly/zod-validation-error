import * as zod from 'zod/v4';

describe('zod', () => {
  test('provides issue.input to errorMap by default', () => {
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

  test('does NOT provide issue.input on error by default', () => {
    const schema = zod.object({
      input: zod.string(),
    });

    const result = schema.safeParse({ input: 123 });
    if (result.success) {
      throw new Error('Expected failure');
    }

    expect(result.error.issues[0].input).toBeUndefined();
  });

  test('provides issue.input on error when reportInput flag is true', () => {
    const schema = zod.object({
      input: zod.string(),
    });

    const result = schema.safeParse(
      { input: 123 },
      {
        reportInput: true,
      }
    );
    if (result.success) {
      throw new Error('Expected failure');
    }

    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Invalid input: expected string, received number"`
    );
    expect(result.error.issues[0].input).toBe(123);
  });

  test('exposes globalConfig object with errorMap set to undefined by default', () => {
    expect(zod.core.globalConfig.customError).toBeUndefined();
  });
});
