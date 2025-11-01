import * as zod from 'zod/v4';

import { createErrorMap } from './errorMap.ts';

describe('errorMap', () => {
  beforeAll(() => {
    zod.config({
      customError: createErrorMap(),
    });
  });

  afterAll(() => {
    zod.config({
      customError: undefined,
    });
  });

  describe('invalid string format', () => {
    test('date', () => {
      const schema = zod.object({
        input: zod.iso.date(),
      });
      const result = schema.safeParse({ input: '25-03-2025' });
      if (result.success) {
        throw new Error('Expected failure');
      }

      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected an ISO date"`
      );
    });

    test('email', () => {
      const schema = zod.object({
        input: zod.email(),
      });
      const result = schema.safeParse({ input: 'not-email' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected an email address"`
      );
    });

    test('url', () => {
      const schema = zod.object({
        input: zod.url(),
      });
      const result = schema.safeParse({ input: 'not-url' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected a URL"`
      );
    });

    test('emoji', () => {
      const schema = zod.object({
        input: zod.emoji(),
      });
      const result = schema.safeParse({ input: 'not-emoji' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected an emoji"`
      );
    });

    test('uuid', () => {
      const schema = zod.object({
        input: zod.uuid(),
      });
      const result = schema.safeParse({ input: 'not-uuid' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected a UUID"`
      );
    });

    test('uuid v7', () => {
      const schema = zod.object({
        input: zod.uuidv7(),
      });
      const result = schema.safeParse({ input: 'not-uuid-v7' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected a UUID v7"`
      );
    });

    test('guid', () => {
      const schema = zod.object({
        input: zod.guid(),
      });
      const result = schema.safeParse({ input: 'not-guid' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected a GUID"`
      );
    });

    test('nanoid', () => {
      const schema = zod.object({
        input: zod.nanoid(),
      });
      const result = schema.safeParse({ input: 'not-nanoid' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected a nanoid"`
      );
    });

    test('cuid', () => {
      const schema = zod.object({
        input: zod.cuid(),
      });
      const result = schema.safeParse({ input: 'not-cuid' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected a CUID"`
      );
    });

    test('cuid2', () => {
      const schema = zod.object({
        input: zod.cuid2(),
      });
      const result = schema.safeParse({ input: 'not-cuid2' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected a CUID2"`
      );
    });

    test('ulid', () => {
      const schema = zod.object({
        input: zod.ulid(),
      });
      const result = schema.safeParse({ input: 'not-ulid' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected a ULID"`
      );
    });

    test('xid', () => {
      const schema = zod.object({
        input: zod.xid(),
      });
      const result = schema.safeParse({ input: 'not-an-xid' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected a XID"`
      );
    });

    test('ksuid', () => {
      const schema = zod.object({
        input: zod.ksuid(),
      });
      const result = schema.safeParse({ input: 'not-ksuid' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected a KSUID"`
      );
    });

    test('datetime', () => {
      const schema = zod.object({
        input: zod.iso.datetime(),
      });
      const result = schema.safeParse({ input: 'not-datetime' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected an ISO datetime"`
      );
    });

    test('time', () => {
      const schema = zod.object({
        input: zod.iso.time(),
      });
      const result = schema.safeParse({ input: 'not-time' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected an ISO time"`
      );
    });

    test('duration', () => {
      const schema = zod.object({
        input: zod.iso.duration(),
      });
      const result = schema.safeParse({ input: 'not-duration' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected an ISO duration"`
      );
    });

    test('ipv4', () => {
      const schema = zod.object({
        input: zod.ipv4(),
      });
      const result = schema.safeParse({ input: 'not-an-ipv4' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected an IPv4 address"`
      );
    });

    test('ipv6', () => {
      const schema = zod.object({
        input: zod.ipv6(),
      });
      const result = schema.safeParse({ input: 'not-an-ipv6' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected an IPv6 address"`
      );
    });

    test('cidrv4', () => {
      const schema = zod.object({
        input: zod.cidrv4(),
      });
      const result = schema.safeParse({ input: 'not-cidrv4' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected a CIDRv4 address range"`
      );
    });

    test('cidrv6', () => {
      const schema = zod.object({
        input: zod.cidrv6(),
      });
      const result = schema.safeParse({ input: 'not-cidrv6' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected a CIDRv6 address range"`
      );
    });

    test('base64', () => {
      const schema = zod.object({
        input: zod.base64(),
      });
      const result = schema.safeParse({ input: 'not-base64' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected a base64 encoded string"`
      );
    });

    test('base64url', () => {
      const schema = zod.object({
        input: zod.base64url(),
      });
      const result = schema.safeParse({ input: 'not-base64url' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected a base64url encoded string"`
      );
    });

    test('e164', () => {
      const schema = zod.object({
        input: zod.e164(),
      });
      const result = schema.safeParse({ input: 'not-e164' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected an E.164 formatted phone number"`
      );
    });

    test('lowercase', () => {
      const schema = zod.object({
        input: zod.string().lowercase(),
      });
      const result = schema.safeParse({ input: 'NOTLOWERCASE' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected lowercase string"`
      );
    });

    test('uppercase', () => {
      const schema = zod.object({
        input: zod.string().uppercase(),
      });
      const result = schema.safeParse({ input: 'notuppercase' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected uppercase string"`
      );
    });

    test('regex', () => {
      const schema = zod.object({
        input: zod.string().regex(/^abc$/),
      });
      const result = schema.safeParse({ input: 'def' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected string to match pattern"`
      );
    });

    test('regex format with `displayInvalidFormatDetails` set to true', () => {
      const schema = zod.object({
        input: zod.string().regex(/^abc$/, {
          error: createErrorMap({
            displayInvalidFormatDetails: true,
          }),
        }),
      });
      const result = schema.safeParse({ input: 'def' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected string to match pattern "/^abc$/""`
      );
    });

    test('jwt', () => {
      const schema = zod.object({
        input: zod.jwt({
          alg: 'HS256',
        }),
      });
      const result = schema.safeParse({ input: 'not-jwt' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected a jwt token"`
      );
    });

    // TODO: Open issue to fix this in zod v4
    // the type expectation for issue.alg is not correct
    test('jwt format with `displayInvalidFormatDetails` set to true', () => {
      const schema = zod.object({
        input: zod.jwt({
          alg: 'HS256',
          error: createErrorMap({
            displayInvalidFormatDetails: true,
          }),
        }),
      });
      const result = schema.safeParse({ input: 'def' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected a jwt/HS256 token"`
      );
    });

    test('starts_with', () => {
      const schema = zod.object({
        input: zod.string().startsWith('abc'),
      });
      const result = schema.safeParse({ input: 'def' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected string to start with "abc""`
      );
    });

    test('ends_with', () => {
      const schema = zod.object({
        input: zod.string().endsWith('xyz'),
      });
      const result = schema.safeParse({ input: 'abc' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected string to end with "xyz""`
      );
    });

    test('includes', () => {
      const schema = zod.object({
        input: zod.string().includes('foo'),
      });
      const result = schema.safeParse({ input: 'bar' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected string to include "foo""`
      );
    });

    test('hash', () => {
      const schema = zod.object({
        input: zod.hash('sha256'),
      });
      const result = schema.safeParse({ input: 'not-a-hash' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected a SHA256 hex-encoded hash"`
      );
    });

    test('hash with custom encoding', () => {
      const schema = zod.object({
        input: zod.hash('md5', { enc: 'base64url' }),
      });
      const result = schema.safeParse({ input: 'not-a-hash' });
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected a MD5 base64url-encoded hash"`
      );
    });

    test('displays actual value when reportInput is set to "typeAndValue', () => {
      const schema = zod.object({
        input: zod.string().includes('foo'),
      });
      const result = schema.safeParse(
        { input: 'bar' },
        {
          error: createErrorMap({
            reportInput: 'typeAndValue',
          }),
        }
      );
      if (result.success) throw new Error('Expected failure');
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected string to include "foo", received "bar""`
      );
    });
  });

  describe('invalid type', () => {
    test('object property', () => {
      const schema = zod.object({
        input: zod.string(),
      });
      const result = schema.safeParse({ input: 123 });
      if (result.success) {
        throw new Error('Expected failure');
      }

      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected string, received number"`
      );
    });

    test('array item', () => {
      const schema = zod.array(zod.int());
      const result = schema.safeParse(['abc', true, new Date()]);

      if (result.success) {
        throw new Error('Expected failure');
      }

      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected number, received string"`
      );
    });

    test('object property missing', () => {
      const schema = zod.object({
        input: zod.string(),
      });
      const result = schema.safeParse({});
      if (result.success) {
        throw new Error('Expected failure');
      }

      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected string, received undefined"`
      );
    });

    test('object property set to undefined', () => {
      const schema = zod.object({
        input: zod.string(),
      });
      const result = schema.safeParse({ input: undefined });
      if (result.success) {
        throw new Error('Expected failure');
      }

      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected string, received undefined"`
      );
    });

    test('object property set to null', () => {
      const schema = zod.object({
        input: zod.string(),
      });
      const result = schema.safeParse({ input: null });
      if (result.success) {
        throw new Error('Expected failure');
      }

      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected string, received null"`
      );
    });

    test('does NOT report input type when reportInput is set to false', () => {
      const schema = zod.object({
        input: zod.string(),
      });
      const result = schema.safeParse(
        { input: 123 },
        {
          error: createErrorMap({
            reportInput: false,
          }),
        }
      );
      if (result.success) {
        throw new Error('Expected failure');
      }

      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected string"`
      );
    });

    test('displays input value when reportInput is set to "typeAndValue"', () => {
      const schema = zod.object({
        input: zod.string(),
      });
      const result = schema.safeParse(
        { input: 123 },
        {
          error: createErrorMap({
            reportInput: 'typeAndValue',
          }),
        }
      );
      if (result.success) {
        throw new Error('Expected failure');
      }

      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected string, received number (123)"`
      );
    });
  });

  describe('invalid literal', () => {
    test('string', () => {
      const schema = zod.object({
        input: zod.literal('foo'),
      });
      const result = schema.safeParse({ input: 'bar' });
      if (result.success) {
        throw new Error('Expected failure');
      }

      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected value to be "foo""`
      );
    });

    test('number', () => {
      const schema = zod.object({
        input: zod.literal(123),
      });
      const result = schema.safeParse({ input: 321 });
      if (result.success) {
        throw new Error('Expected failure');
      }

      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected value to be 123"`
      );
    });

    test('displays the input value when reportInput is set to "typeAndValue"', () => {
      const schema = zod.object({
        input: zod.literal('foo'),
      });
      const result = schema.safeParse(
        { input: 'bar' },
        {
          error: createErrorMap({
            reportInput: 'typeAndValue',
          }),
        }
      );
      if (result.success) {
        throw new Error('Expected failure');
      }

      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected value to be "foo", received "bar""`
      );
    });
  });

  describe('invalid enumeration', () => {
    test('string values', () => {
      const schema = zod.object({
        input: zod.enum(['foo', 'bar']),
      });
      const result = schema.safeParse({ input: 'abc' });
      if (result.success) {
        throw new Error('Expected failure');
      }

      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected value to be one of "foo" or "bar""`
      );
    });

    test('mixed string/number values', () => {
      const schema = zod.object({
        input: zod.enum({
          one: 1,
          two: 'two',
          three: 3,
        }),
      });
      const result = schema.safeParse({ input: 'four' });
      if (result.success) {
        throw new Error('Expected failure');
      }

      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected value to be one of 1, "two" or 3"`
      );
    });

    test('mixed string/number values with custom options', () => {
      const schema = zod.object({
        input: zod.enum(
          {
            one: 1,
            two: 'two',
            three: 3,
          },
          {
            error: createErrorMap({
              allowedValuesSeparator: '|',
              allowedValuesLastSeparator: undefined,
              wrapAllowedValuesInQuote: false,
              maxAllowedValuesToDisplay: 3,
            }),
          }
        ),
      });
      const result = schema.safeParse({ input: 'four' });
      if (result.success) {
        throw new Error('Expected failure');
      }

      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected value to be one of 1|two|3"`
      );
    });

    test('mixed string/number values with reportInput set to "typeAndValue"', () => {
      const schema = zod.object({
        input: zod.enum({
          one: 1,
          two: 'two',
          three: 3,
        }),
      });
      const result = schema.safeParse(
        { input: 'four' },
        {
          error: createErrorMap({
            reportInput: 'typeAndValue',
          }),
        }
      );
      if (result.success) {
        throw new Error('Expected failure');
      }

      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected value to be one of 1, "two" or 3, received "four""`
      );
    });

    test('single value', () => {
      const schema = zod.object({
        input: zod.enum({
          one: 1,
        }),
      });
      const result = schema.safeParse({ input: 'four' });
      if (result.success) {
        throw new Error('Expected failure');
      }

      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected value to be 1"`
      );
    });

    test('stringbool', () => {
      const schema = zod.object({
        input: zod.stringbool(),
      });
      const result = schema.safeParse(
        { input: 'foobar' },
        {
          error: createErrorMap({
            reportInput: 'typeAndValue',
          }),
        }
      );
      if (result.success) {
        throw new Error('Expected failure');
      }

      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected boolean as string, received "foobar""`
      );
    });

    test('exceeds values to display', () => {
      const schema = zod.object({
        input: zod.enum({
          one: 'one',
          two: 'two',
          three: 'three',
          four: 'four',
          five: 'five',
          six: 'six',
          seven: 'seven',
        }),
      });
      const result = schema.safeParse(
        { input: 'fourtytwo' },
        {
          error: createErrorMap({
            maxAllowedValuesToDisplay: 3,
            reportInput: 'typeAndValue',
          }),
        }
      );
      if (result.success) {
        throw new Error('Expected failure');
      }

      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected value to be one of "one", "two", "three" or 4 more value(s), received "fourtytwo""`
      );
    });
  });

  describe('invalid multiple of', () => {
    test('multiple of 2', () => {
      const schema = zod.object({
        input: zod.int().multipleOf(2),
      });
      const result = schema.safeParse({
        input: 3,
      });
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected multiple of 2"`
      );
    });

    test('multiple of 2 with reportInput set to "typeAndValue', () => {
      const schema = zod.object({
        input: zod.int().multipleOf(2),
      });
      const result = schema.safeParse(
        {
          input: 3,
        },
        {
          error: createErrorMap({
            reportInput: 'typeAndValue',
          }),
        }
      );
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected multiple of 2, received 3"`
      );
    });
  });

  describe('invalid max', () => {
    test('character limit', () => {
      const schema = zod.object({
        input: zod.string().max(3),
      });
      const result = schema.safeParse({
        input: 'hello',
      });
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected string to contain at most 3 character(s)"`
      );
    });

    test('character limit with reportInput set to "typeAndValue', () => {
      const schema = zod.object({
        input: zod.string().max(3),
      });
      const result = schema.safeParse(
        {
          input: 'hello',
        },
        {
          error: createErrorMap({
            reportInput: 'typeAndValue',
          }),
        }
      );
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected string to contain at most 3 character(s), received "hello""`
      );
    });

    test('number', () => {
      const schema = zod.object({
        input: zod.number().max(10),
      });
      const result = schema.safeParse({
        input: 20,
      });
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected number to be less than or equal to 10"`
      );
    });

    test('less than number', () => {
      const schema = zod.object({
        input: zod.number().lt(10),
      });
      const result = schema.safeParse({
        input: 10,
      });
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected number to be less than 10"`
      );
    });

    test('array items count', () => {
      const schema = zod.object({
        input: zod.array(zod.string()).max(2),
      });
      const result = schema.safeParse({
        input: ['a', 'b', 'c'],
      });
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected array to contain at most 2 item(s)"`
      );
    });

    test('set items count', () => {
      const schema = zod.object({
        input: zod.set(zod.string()).max(2),
      });
      const result = schema.safeParse({
        input: new Set(['a', 'b', 'c']),
      });
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected set to contain at most 2 item(s)"`
      );
    });

    test('date', () => {
      const maxDate = new Date('2020-01-01');
      const schema = zod.object({
        input: zod.date().max(maxDate),
      });
      const result = schema.safeParse({
        input: new Date('2021-01-01'),
      });
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0].message).toBe(
        `expected date to be prior or equal to "${maxDate.toLocaleString()}"`
      );
    });

    test('bigint', () => {
      const schema = zod.object({
        input: zod.bigint().max(100n),
      });
      const result = schema.safeParse({
        input: 200n,
      });
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected number to be less than or equal to 100"`
      );
    });

    test('bigint with custom error message', () => {
      const schema = zod.object({
        input: zod.bigint().max(100n, {
          message: 'Custom error message',
        }),
      });
      const result = schema.safeParse({
        input: 200n,
      });
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"Custom error message"`
      );
    });
  });

  describe('invalid min', () => {
    test('character limit', () => {
      const schema = zod.string().min(5);
      const result = schema.safeParse('abc');
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected string to contain at least 5 character(s)"`
      );
    });

    test('number', () => {
      const schema = zod.number().min(10);
      const result = schema.safeParse(5);
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected number to be greater than or equal to 10"`
      );
    });

    test('number with reportInput set to "typeAndValue"', () => {
      const schema = zod.number().min(10);
      const result = schema.safeParse(5, {
        error: createErrorMap({
          reportInput: 'typeAndValue',
        }),
      });
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected number to be greater than or equal to 10, received 5"`
      );
    });

    test('greater than number', () => {
      const schema = zod.number().gt(10);
      const result = schema.safeParse(10);
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected number to be greater than 10"`
      );
    });

    test('array items count', () => {
      const schema = zod.array(zod.string()).min(3);
      const result = schema.safeParse(['a']);
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected array to contain at least 3 item(s)"`
      );
    });

    test('set items count', () => {
      const schema = zod.set(zod.string()).min(3);
      const result = schema.safeParse(new Set(['a']));
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected set to contain at least 3 item(s)"`
      );
    });

    test('date', () => {
      const minDate = new Date('2020-01-01');
      const schema = zod.date().min(minDate);
      const result = schema.safeParse(new Date('2019-01-01'));
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0].message).toBe(
        `expected date to be later or equal to "${minDate.toLocaleString()}"`
      );
    });

    test('date with custom error message', () => {
      const schema = zod.date().min(new Date('2020-01-01'), {
        message: 'Custom error message',
      });
      const result = schema.safeParse(new Date('2019-01-01'));
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"Custom error message"`
      );
    });

    test('bigint', () => {
      const schema = zod.bigint().min(100n);
      const result = schema.safeParse(50n);
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"expected number to be greater than or equal to 100"`
      );
    });
  });

  describe('unrecognized key', () => {
    test('single key', () => {
      const schema = zod
        .object({
          a1: zod.string(),
        })
        .strict();
      const result = schema.safeParse({
        a1: 'a1',
        b2: 'b2',
      });
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"unrecognized key(s) "b2" in object"`
      );
    });

    test('multiple keys', () => {
      const schema = zod
        .object({
          a1: zod.string(),
        })
        .strict();
      const result = schema.safeParse({
        a1: 'a1',
        b2: 'b2',
        c3: 'c3',
        d4: 'd4',
      });
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"unrecognized key(s) "b2", "c3" and "d4" in object"`
      );
    });
  });

  describe('invalid union', () => {
    test('json string', () => {
      const schema = zod.object({
        input: zod.json(),
      });
      const result = schema.safeParse({ input: new Date() });
      if (result.success) throw new Error('Expected failure');

      // check that underlying issues are formatted with our custom error map
      expect(result.error.issues[0]).toMatchInlineSnapshot(`
        {
          "code": "invalid_union",
          "errors": [
            [
              {
                "code": "invalid_type",
                "expected": "string",
                "message": "expected string, received date",
                "path": [],
              },
            ],
            [
              {
                "code": "invalid_type",
                "expected": "number",
                "message": "expected number, received date",
                "path": [],
              },
            ],
            [
              {
                "code": "invalid_type",
                "expected": "boolean",
                "message": "expected boolean, received date",
                "path": [],
              },
            ],
            [
              {
                "code": "invalid_type",
                "expected": "null",
                "message": "expected null, received date",
                "path": [],
              },
            ],
            [
              {
                "code": "invalid_type",
                "expected": "array",
                "message": "expected array, received date",
                "path": [],
              },
            ],
            [
              {
                "code": "invalid_type",
                "expected": "record",
                "message": "expected record, received date",
                "path": [],
              },
            ],
          ],
          "message": "Invalid input",
          "path": [
            "input",
          ],
        }
      `);
    });

    test('deeply nested', () => {
      const baz = zod.number().min(1).optional();

      const bar = zod.strictObject({
        baz,
      });

      const foo = zod.strictObject({
        bar: zod.literal(false).or(bar).optional(),
      });

      const schema = zod.object({
        foo,
      });

      const result = schema.safeParse({
        foo: {
          bar: {
            baz: 0,
          },
        },
      });
      if (result.success) throw new Error('Expected failure');

      // check that underlying issues are formatted with our custom error map
      expect(result.error.issues[0]).toMatchInlineSnapshot(`
        {
          "code": "too_small",
          "inclusive": true,
          "message": "expected number to be greater than or equal to 1",
          "minimum": 1,
          "origin": "number",
          "path": [
            "foo",
            "bar",
            "baz",
          ],
        }
      `);
    });

    test('primitive string|null', () => {
      const schema = zod.union([zod.string(), zod.null()]);

      const result = schema.safeParse(10);
      if (result.success) throw new Error('Expected failure');

      // check that underlying issues are formatted with our custom error map
      expect(result.error.issues[0]).toMatchInlineSnapshot(`
        {
          "code": "invalid_union",
          "errors": [
            [
              {
                "code": "invalid_type",
                "expected": "string",
                "message": "expected string, received number",
                "path": [],
              },
            ],
            [
              {
                "code": "invalid_type",
                "expected": "null",
                "message": "expected null, received number",
                "path": [],
              },
            ],
          ],
          "message": "Invalid input",
          "path": [],
        }
      `);
    });
  });
});
