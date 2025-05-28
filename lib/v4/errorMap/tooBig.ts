import type { AbstractSyntaxTree } from './types.ts';
import type * as zod from 'zod/v4/core';

export function parseTooBigIssue(
  issue: zod.$ZodIssueTooBig
): AbstractSyntaxTree {
  switch (issue.origin) {
    case 'number':
    case 'int':
    case 'bigint': {
      return {
        type: issue.code,
        path: issue.path,
        claim: 'number too big',
        expectation: `expected <${
          issue.inclusive ? '=' : ''
        } ${issue.maximum.toLocaleString()}`,
        realization: compileNumericValueRealization(issue),
      };
    }
    case 'date': {
      return {
        type: issue.code,
        path: issue.path,
        claim: 'invalid date',
        expectation: `expected ${
          issue.inclusive ? 'prior or equal to' : 'prior to'
        } ${new Date(issue.maximum as number).toLocaleString()}`,
      };
    }
    case 'string': {
      return {
        type: issue.code,
        path: issue.path,
        claim: 'string contains too many characters',
        expectation: `expected <${
          issue.inclusive ? '=' : ''
        } ${issue.maximum.toLocaleString()} character${
          issue.maximum === 1 ? '' : 's'
        }`,
        realization: compileCharacterLengthRealization(issue),
      };
    }
    case 'array': {
      return {
        type: issue.code,
        path: issue.path,
        claim: 'array contains too many items',
        expectation: `expected <${
          issue.inclusive ? '=' : ''
        } ${issue.maximum.toLocaleString()} in size`,
        realization: compileArraySizeRealization(issue),
      };
    }
    case 'set': {
      return {
        type: issue.code,
        path: issue.path,
        claim: 'set contains too many items',
        expectation: `expected <${
          issue.inclusive ? '=' : ''
        } ${issue.maximum.toLocaleString()} in size`,
        realization: compileSetSizeRealization(issue),
      };
    }
    case 'file': {
      return {
        type: issue.code,
        path: issue.path,
        claim: 'file is too large in size',
        expectation: `expected <${
          issue.inclusive ? '=' : ''
        } ${issue.maximum.toLocaleString()} byte${
          issue.maximum === 1 ? '' : 's'
        }`,
        realization: compileFileSizeRealization(issue),
      };
    }
    default:
      return {
        type: issue.code,
        path: issue.path,
        claim: 'invalid value',
        expectation: `expected <${
          issue.inclusive ? '=' : ''
        } ${issue.maximum.toLocaleString()}`,
      };
  }
} // export interface $ZodIssueStringInvalidJWT extends $ZodIssueInvalidStringFormat {
export function compileNumericValueRealization(
  issue: zod.$ZodIssue
): string | undefined {
  switch (typeof issue.input) {
    case 'number':
    case 'bigint':
      return `received ${issue.input.toLocaleString()}`;
    default:
      return undefined;
  }
}

export function compileCharacterLengthRealization(
  issue: zod.$ZodIssue
): string | undefined {
  switch (typeof issue.input) {
    case 'string':
      return `received ${issue.input.length.toLocaleString()} character${
        issue.input.length === 1 ? '' : 's'
      }`;
    default:
      return undefined;
  }
}

export function compileArraySizeRealization(
  issue: zod.$ZodIssue
): string | undefined {
  if (Array.isArray(issue.input)) {
    return `received ${issue.input.length.toLocaleString()} item${
      issue.input.length === 1 ? '' : 's'
    }`;
  }

  return undefined;
}

export function compileSetSizeRealization(
  issue: zod.$ZodIssue
): string | undefined {
  if (issue.input instanceof Set) {
    return `received ${issue.input.size.toLocaleString()} item${
      issue.input.size === 1 ? '' : 's'
    }`;
  }

  return undefined;
}

export function compileFileSizeRealization(
  issue: zod.$ZodIssue
): string | undefined {
  if (issue.input instanceof File) {
    return `received ${issue.input.size.toLocaleString()} byte${
      issue.input.size === 1 ? '' : 's'
    }`;
  }

  return undefined;
}
