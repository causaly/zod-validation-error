import * as zod from 'zod/v4';

import { createErrorMap } from './errorMap.ts';

zod.config({
  customError: createErrorMap({
    includePath: true,
  }),
});

describe('invalid_string_format issue parser', () => {
  test('handles date format', () => {
    const schema = zod.object({
      input: zod.iso.date(),
    });
    const result = schema.safeParse({ input: '25-03-2025' });
    if (result.success) {
      throw new Error('Expected failure');
    }

    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; expected date format"`
    );
  });

  test('handles email format', () => {
    const schema = zod.object({
      input: zod.email(),
    });
    const result = schema.safeParse({ input: 'not-an-email' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; expected email format"`
    );
  });

  test('handles url format', () => {
    const schema = zod.object({
      input: zod.url(),
    });
    const result = schema.safeParse({ input: 'not-a-url' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; expected url format"`
    );
  });

  test('handles emoji format', () => {
    const schema = zod.object({
      input: zod.emoji(),
    });
    const result = schema.safeParse({ input: 'not-emoji' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; expected emoji format"`
    );
  });

  test('handles uuid format', () => {
    const schema = zod.object({
      input: zod.uuid(),
    });
    const result = schema.safeParse({ input: 'not-a-uuid' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; expected uuid format"`
    );
  });

  test('handles guid format', () => {
    const schema = zod.object({
      input: zod.guid(),
    });
    const result = schema.safeParse({ input: 'not-a-guid' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; expected guid format"`
    );
  });

  test('handles nanoid format', () => {
    const schema = zod.object({
      input: zod.nanoid(),
    });
    const result = schema.safeParse({ input: 'not-a-nanoid' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; expected nanoid format"`
    );
  });

  test('handles cuid format', () => {
    const schema = zod.object({
      input: zod.cuid(),
    });
    const result = schema.safeParse({ input: 'not-a-cuid' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; expected cuid format"`
    );
  });

  test('handles cuid2 format', () => {
    const schema = zod.object({
      input: zod.cuid2(),
    });
    const result = schema.safeParse({ input: 'not-a-cuid2' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; expected cuid2 format"`
    );
  });

  test('handles ulid format', () => {
    const schema = zod.object({
      input: zod.ulid(),
    });
    const result = schema.safeParse({ input: 'not-a-ulid' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; expected ulid format"`
    );
  });

  test('handles xid format', () => {
    const schema = zod.object({
      input: zod.xid(),
    });
    const result = schema.safeParse({ input: 'not-an-xid' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; expected xid format"`
    );
  });

  test('handles ksuid format', () => {
    const schema = zod.object({
      input: zod.ksuid(),
    });
    const result = schema.safeParse({ input: 'not-a-ksuid' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; expected ksuid format"`
    );
  });

  test('handles datetime format', () => {
    const schema = zod.object({
      input: zod.iso.datetime(),
    });
    const result = schema.safeParse({ input: 'not-a-datetime' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; expected datetime format"`
    );
  });

  test('handles time format', () => {
    const schema = zod.object({
      input: zod.iso.time(),
    });
    const result = schema.safeParse({ input: 'not-a-time' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; expected time format"`
    );
  });

  test('handles duration format', () => {
    const schema = zod.object({
      input: zod.iso.duration(),
    });
    const result = schema.safeParse({ input: 'not-a-duration' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; expected duration format"`
    );
  });

  test('handles ipv4 format', () => {
    const schema = zod.object({
      input: zod.ipv4(),
    });
    const result = schema.safeParse({ input: 'not-an-ipv4' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; expected ipv4 format"`
    );
  });

  test('handles ipv6 format', () => {
    const schema = zod.object({
      input: zod.ipv6(),
    });
    const result = schema.safeParse({ input: 'not-an-ipv6' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; expected ipv6 format"`
    );
  });

  test('handles cidrv4 format', () => {
    const schema = zod.object({
      input: zod.cidrv4(),
    });
    const result = schema.safeParse({ input: 'not-a-cidrv4' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; expected cidrv4 format"`
    );
  });

  test('handles cidrv6 format', () => {
    const schema = zod.object({
      input: zod.cidrv6(),
    });
    const result = schema.safeParse({ input: 'not-a-cidrv6' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; expected cidrv6 format"`
    );
  });

  test('handles base64 format', () => {
    const schema = zod.object({
      input: zod.base64(),
    });
    const result = schema.safeParse({ input: 'not-base64' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; expected base64 format"`
    );
  });

  test('handles base64url format', () => {
    const schema = zod.object({
      input: zod.base64url(),
    });
    const result = schema.safeParse({ input: 'not-base64url' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; expected base64url format"`
    );
  });

  // test.only('handles json_string format', () => {
  //   const schema = zod.object({
  //     input: zod.json(),
  //   });
  //   const result = schema.safeParse({ input: new Date() });
  //   if (result.success) throw new Error('Expected failure');

  //   expect(result.error.issues[0].message).toMatchInlineSnapshot(`
  //     {
  //       "code": "invalid_format",
  //       "format": "json_string",
  //       "message": "invalid string format at "input"; expected json_string, received "not-json"",
  //       "origin": "string",
  //       "path": [
  //         "input",
  //       ],
  //     }
  //   `);
  // });

  test('handles e164 format', () => {
    const schema = zod.object({
      input: zod.e164(),
    });
    const result = schema.safeParse({ input: 'not-e164' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; expected e164 format"`
    );
  });

  test('handles lowercase format', () => {
    const schema = zod.object({
      input: zod.string().lowercase(),
    });
    const result = schema.safeParse({ input: 'NOTLOWERCASE' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; expected all characters to be in lowercase format"`
    );
  });

  test('handles uppercase format', () => {
    const schema = zod.object({
      input: zod.string().uppercase(),
    });
    const result = schema.safeParse({ input: 'notuppercase' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; expected all characters to be in uppercase format"`
    );
  });

  test('handles regex format', () => {
    const schema = zod.object({
      input: zod.string().regex(/^abc$/),
    });
    const result = schema.safeParse({ input: 'def' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; does not match expected pattern"`
    );
  });

  test('handles regex format with `displayInvalidFormatDetails` set to true', () => {
    const schema = zod.object({
      input: zod.string().regex(/^abc$/, {
        error: createErrorMap({
          displayInvalidFormatDetails: true,
          includePath: false,
        }),
      }),
    });
    const result = schema.safeParse({ input: 'def' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value; should match pattern "/^abc$/""`
    );
  });

  test('handles jwt format', () => {
    const schema = zod.object({
      input: zod.jwt({
        alg: 'HS256',
      }),
    });
    const result = schema.safeParse({ input: 'not-a-jwt' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; expected jwt format"`
    );
  });

  // TODO: Open issue to fix this in zod v4
  // the type expectation for issue.alg is not correct
  // test('handles jwt format with `displayInvalidFormatDetails` set to true', () => {
  //   const schema = zod.object({
  //     input: zod.jwt({
  //       alg: 'HS256',
  //       error: createErrorMap({
  //         displayInvalidFormatDetails: true,
  //         includePath: false,
  //       }),
  //     }),
  //   });
  //   const result = schema.safeParse({ input: 'def' });
  //   if (result.success) throw new Error('Expected failure');
  //   expect(result.error.issues[0].message).toMatchInlineSnapshot(
  //     `"malformed value; expected jwt format"`
  //   );
  // });

  test('handles starts_with format', () => {
    const schema = zod.object({
      input: zod.string().startsWith('abc'),
    });
    const result = schema.safeParse({ input: 'def' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; should start with "abc""`
    );
  });

  test('handles ends_with format', () => {
    const schema = zod.object({
      input: zod.string().endsWith('xyz'),
    });
    const result = schema.safeParse({ input: 'abc' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; should end with "xyz""`
    );
  });

  test('handles includes format', () => {
    const schema = zod.object({
      input: zod.string().includes('foo'),
    });
    const result = schema.safeParse({ input: 'bar' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"malformed value at "input"; should include "foo""`
    );
  });
});
