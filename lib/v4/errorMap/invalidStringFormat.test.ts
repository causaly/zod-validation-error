import * as zod from 'zod/v4';

import { createErrorMap } from './errorMap.ts';

zod.config({
  customError: createErrorMap({
    includePath: true,
  }),
});

describe('parseInvalidStringFormatIssue', () => {
  test('handles date format', () => {
    const schema = zod.object({
      input: zod.iso.date(),
    });
    const result = schema.safeParse({ input: '25-03-2025' });
    if (result.success) {
      throw new Error('Expected failure');
    }

    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Invalid date at "input""`
    );
  });

  test('handles email format', () => {
    const schema = zod.object({
      input: zod.email(),
    });
    const result = schema.safeParse({ input: 'not-an-email' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Invalid email at "input""`
    );
  });

  test('handles url format', () => {
    const schema = zod.object({
      input: zod.url(),
    });
    const result = schema.safeParse({ input: 'not-a-url' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Invalid url at "input""`
    );
  });

  test('handles emoji format', () => {
    const schema = zod.object({
      input: zod.emoji(),
    });
    const result = schema.safeParse({ input: 'not-emoji' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Invalid emoji at "input""`
    );
  });

  test('handles uuid format', () => {
    const schema = zod.object({
      input: zod.uuid(),
    });
    const result = schema.safeParse({ input: 'not-a-uuid' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Invalid uuid at "input""`
    );
  });

  test('handles guid format', () => {
    const schema = zod.object({
      input: zod.guid(),
    });
    const result = schema.safeParse({ input: 'not-a-guid' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Invalid guid at "input""`
    );
  });

  test('handles nanoid format', () => {
    const schema = zod.object({
      input: zod.nanoid(),
    });
    const result = schema.safeParse({ input: 'not-a-nanoid' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Invalid nanoid at "input""`
    );
  });

  test('handles cuid format', () => {
    const schema = zod.object({
      input: zod.cuid(),
    });
    const result = schema.safeParse({ input: 'not-a-cuid' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Invalid cuid at "input""`
    );
  });

  test('handles cuid2 format', () => {
    const schema = zod.object({
      input: zod.cuid2(),
    });
    const result = schema.safeParse({ input: 'not-a-cuid2' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Invalid cuid2 at "input""`
    );
  });

  test('handles ulid format', () => {
    const schema = zod.object({
      input: zod.ulid(),
    });
    const result = schema.safeParse({ input: 'not-a-ulid' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Invalid ulid at "input""`
    );
  });

  test('handles xid format', () => {
    const schema = zod.object({
      input: zod.xid(),
    });
    const result = schema.safeParse({ input: 'not-an-xid' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Invalid xid at "input""`
    );
  });

  test('handles ksuid format', () => {
    const schema = zod.object({
      input: zod.ksuid(),
    });
    const result = schema.safeParse({ input: 'not-a-ksuid' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Invalid ksuid at "input""`
    );
  });

  test('handles datetime format', () => {
    const schema = zod.object({
      input: zod.iso.datetime(),
    });
    const result = schema.safeParse({ input: 'not-a-datetime' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Invalid datetime at "input""`
    );
  });

  test('handles time format', () => {
    const schema = zod.object({
      input: zod.iso.time(),
    });
    const result = schema.safeParse({ input: 'not-a-time' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Invalid time at "input""`
    );
  });

  test('handles duration format', () => {
    const schema = zod.object({
      input: zod.iso.duration(),
    });
    const result = schema.safeParse({ input: 'not-a-duration' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Invalid duration at "input""`
    );
  });

  test('handles ipv4 format', () => {
    const schema = zod.object({
      input: zod.ipv4(),
    });
    const result = schema.safeParse({ input: 'not-an-ipv4' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Invalid ipv4 at "input""`
    );
  });

  test('handles ipv6 format', () => {
    const schema = zod.object({
      input: zod.ipv6(),
    });
    const result = schema.safeParse({ input: 'not-an-ipv6' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Invalid ipv6 at "input""`
    );
  });

  test('handles cidrv4 format', () => {
    const schema = zod.object({
      input: zod.cidrv4(),
    });
    const result = schema.safeParse({ input: 'not-a-cidrv4' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Invalid cidrv4 at "input""`
    );
  });

  test('handles cidrv6 format', () => {
    const schema = zod.object({
      input: zod.cidrv6(),
    });
    const result = schema.safeParse({ input: 'not-a-cidrv6' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Invalid cidrv6 at "input""`
    );
  });

  test('handles base64 format', () => {
    const schema = zod.object({
      input: zod.base64(),
    });
    const result = schema.safeParse({ input: 'not-base64' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Invalid base64 at "input""`
    );
  });

  test('handles base64url format', () => {
    const schema = zod.object({
      input: zod.base64url(),
    });
    const result = schema.safeParse({ input: 'not-base64url' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Invalid base64url at "input""`
    );
  });

  test('handles e164 format', () => {
    const schema = zod.object({
      input: zod.e164(),
    });
    const result = schema.safeParse({ input: 'not-e164' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Invalid e164 at "input""`
    );
  });

  test('handles lowercase format', () => {
    const schema = zod.object({
      input: zod.string().lowercase(),
    });
    const result = schema.safeParse({ input: 'NOTLOWERCASE' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Value must be in lowercase format at "input""`
    );
  });

  test('handles uppercase format', () => {
    const schema = zod.object({
      input: zod.string().uppercase(),
    });
    const result = schema.safeParse({ input: 'notuppercase' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Value must be in uppercase format at "input""`
    );
  });

  test('handles regex format', () => {
    const schema = zod.object({
      input: zod.string().regex(/^abc$/),
    });
    const result = schema.safeParse({ input: 'def' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Value must match pattern at "input""`
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
      `"Value must match pattern "/^abc$/""`
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
      `"Invalid jwt at "input""`
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
      `"Value must start with "abc" at "input""`
    );
  });

  test('handles ends_with format', () => {
    const schema = zod.object({
      input: zod.string().endsWith('xyz'),
    });
    const result = schema.safeParse({ input: 'abc' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Value must end with "xyz" at "input""`
    );
  });

  test('handles includes format', () => {
    const schema = zod.object({
      input: zod.string().includes('foo'),
    });
    const result = schema.safeParse({ input: 'bar' });
    if (result.success) throw new Error('Expected failure');
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Value must include "foo" at "input""`
    );
  });
});
