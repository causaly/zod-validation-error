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
        message: `number must be less ${
          issue.inclusive ? 'or equal to' : 'than'
        } ${issue.maximum.toLocaleString()}`,
      };
    }
    case 'date': {
      return {
        type: issue.code,
        path: issue.path,
        message: `date must be ${
          issue.inclusive ? 'prior or equal to' : 'prior to'
        } "${new Date(issue.maximum as number).toLocaleString()}"`,
      };
    }
    case 'string': {
      return {
        type: issue.code,
        path: issue.path,
        message: `string must contain at most ${issue.maximum.toLocaleString()} character(s)`,
      };
    }
    case 'array': {
      return {
        type: issue.code,
        path: issue.path,
        message: `array must contain at most ${issue.maximum.toLocaleString()} item(s)`,
      };
    }
    case 'set': {
      return {
        type: issue.code,
        path: issue.path,
        message: `set must contain at most ${issue.maximum.toLocaleString()} item(s)`,
      };
    }
    case 'file': {
      return {
        type: issue.code,
        path: issue.path,
        message: `file must not exceed ${issue.maximum.toLocaleString()} byte(s) in size`,
      };
    }
    default:
      return {
        type: issue.code,
        path: issue.path,
        message: `value must be less ${
          issue.inclusive ? 'or equal to' : 'than'
        } ${issue.maximum.toLocaleString()}`,
      };
  }
}
