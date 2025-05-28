import {
  compileNumericValueRealization,
  compileCharacterLengthRealization,
  compileArraySizeRealization,
  compileSetSizeRealization,
  compileFileSizeRealization,
} from './tooBig.ts';
import type { AbstractSyntaxTree } from './types.ts';
import type * as zod from 'zod/v4/core';

export function parseTooSmallIssue(
  issue: zod.$ZodIssueTooSmall
): AbstractSyntaxTree {
  switch (issue.origin) {
    case 'number':
    case 'int':
    case 'bigint': {
      return {
        type: issue.code,
        path: issue.path,
        claim: 'number is too small',
        expectation: `expected >${
          issue.inclusive ? '=' : ''
        } ${issue.minimum.toLocaleString()}`,
        realization: compileNumericValueRealization(issue),
      };
    }
    case 'date': {
      return {
        type: issue.code,
        path: issue.path,
        claim: 'invalid date',
        expectation: `expected ${
          issue.inclusive ? 'later or equal to' : 'later to'
        } ${new Date(issue.minimum as number).toLocaleString()}`,
      };
    }
    case 'string': {
      return {
        type: issue.code,
        path: issue.path,
        claim: 'string is too short',
        expectation: `expected >${
          issue.inclusive ? '=' : ''
        } ${issue.minimum.toLocaleString()} character${
          issue.minimum === 1 ? '' : 's'
        }`,
        realization: compileCharacterLengthRealization(issue),
      };
    }
    case 'array': {
      return {
        type: issue.code,
        path: issue.path,
        claim: 'array contains too few items',
        expectation: `expected >${
          issue.inclusive ? '=' : ''
        } ${issue.minimum.toLocaleString()} in size`,
        realization: compileArraySizeRealization(issue),
      };
    }
    case 'set': {
      return {
        type: issue.code,
        path: issue.path,
        claim: 'set contains too few items',
        expectation: `expected >${
          issue.inclusive ? '=' : ''
        } ${issue.minimum.toLocaleString()} in size`,
        realization: compileSetSizeRealization(issue),
      };
    }
    case 'file': {
      return {
        type: issue.code,
        path: issue.path,
        claim: 'file is too small in size',
        expectation: `expected >${
          issue.inclusive ? '=' : ''
        } ${issue.minimum.toLocaleString()} byte${
          issue.minimum === 1 ? '' : 's'
        }`,
        realization: compileFileSizeRealization(issue),
      };
    }
    default:
      return {
        type: issue.code,
        path: issue.path,
        claim: 'invalid value',
        expectation: `expected >${
          issue.inclusive ? '=' : ''
        } ${issue.minimum.toLocaleString()}`,
      };
  }
}
