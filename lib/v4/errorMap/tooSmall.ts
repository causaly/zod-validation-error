import { stringify } from '../../utils/stringify.ts';
import type * as zod from 'zod/v4/core';
import type { AbstractSyntaxTree, ErrorMapOptions } from './types.ts';

export function parseTooSmallIssue(
  issue: zod.$ZodRawIssue<zod.$ZodIssueTooSmall>,
  options: Pick<ErrorMapOptions, 'dateLocalization' | 'numberLocalization'>
): AbstractSyntaxTree {
  const minValueStr =
    issue.origin === 'date'
      ? stringify(new Date(issue.minimum as number), {
          localization: options.dateLocalization,
        })
      : stringify(issue.minimum, {
          localization: options.numberLocalization,
        });

  switch (issue.origin) {
    case 'number':
    case 'int':
    case 'bigint': {
      return {
        type: issue.code,
        path: issue.path,
        message: `number must be greater than${
          issue.inclusive ? ' or equal to' : ''
        } ${minValueStr}`,
      };
    }
    case 'date': {
      return {
        type: issue.code,
        path: issue.path,
        message: `date must be ${
          issue.inclusive ? 'later or equal to' : 'later to'
        } "${minValueStr}"`,
      };
    }
    case 'string': {
      return {
        type: issue.code,
        path: issue.path,
        message: `string must contain at least ${minValueStr} character(s)`,
      };
    }
    case 'array': {
      return {
        type: issue.code,
        path: issue.path,
        message: `array must contain at least ${minValueStr} item(s)`,
      };
    }
    case 'set': {
      return {
        type: issue.code,
        path: issue.path,
        message: `set must contain at least ${minValueStr} item(s)`,
      };
    }
    case 'file': {
      return {
        type: issue.code,
        path: issue.path,
        message: `file must be at least ${minValueStr} byte(s) in size`,
      };
    }
    default:
      return {
        type: issue.code,
        path: issue.path,
        message: `value must be greater than${
          issue.inclusive ? ' or equal to' : ''
        } ${minValueStr}`,
      };
  }
}
