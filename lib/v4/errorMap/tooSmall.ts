import type * as zod from 'zod/v4/core';
import type { AbstractSyntaxTree } from './types.ts';

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
        message: `number must be greater ${
          issue.inclusive ? 'or equal to' : 'than'
        } ${issue.minimum.toLocaleString()}`,
      };
    }
    case 'date': {
      return {
        type: issue.code,
        path: issue.path,
        message: `date must be ${
          issue.inclusive ? 'later or equal to' : 'later to'
        } "${new Date(issue.minimum as number).toLocaleString()}"`,
      };
    }
    case 'string': {
      return {
        type: issue.code,
        path: issue.path,
        message: `string must contain at least ${issue.minimum.toLocaleString()} character(s)`,
      };
    }
    case 'array': {
      return {
        type: issue.code,
        path: issue.path,
        message: `array must contain at least ${issue.minimum.toLocaleString()} item(s)`,
      };
    }
    case 'set': {
      return {
        type: issue.code,
        path: issue.path,
        message: `set must contain at least ${issue.minimum.toLocaleString()} item(s)`,
      };
    }
    case 'file': {
      return {
        type: issue.code,
        path: issue.path,
        message: `file must be at least ${issue.minimum.toLocaleString()} byte(s) in size`,
      };
    }
    default:
      return {
        type: issue.code,
        path: issue.path,
        message: `value must be greater ${
          issue.inclusive ? 'or equal to' : 'than'
        } ${issue.minimum.toLocaleString()}`,
      };
  }
}
