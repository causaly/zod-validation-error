import { stringify } from '../../utils/stringify.ts';
import type { AbstractSyntaxTree, ErrorMapOptions } from './types.ts';
import type * as zod from 'zod/v4/core';

export function parseTooBigIssue(
  issue: zod.$ZodRawIssue<zod.$ZodIssueTooBig>,
  options: Pick<ErrorMapOptions, 'dateLocalization' | 'numberLocalization'>
): AbstractSyntaxTree {
  const maxValueStr =
    issue.origin === 'date'
      ? stringify(new Date(issue.maximum as number), {
          localization: options.dateLocalization,
        })
      : stringify(issue.maximum, {
          localization: options.numberLocalization,
        });

  switch (issue.origin) {
    case 'number':
    case 'int':
    case 'bigint': {
      return {
        type: issue.code,
        path: issue.path,
        message: `number must be less than${
          issue.inclusive ? ' or equal to' : ''
        } ${maxValueStr}`,
      };
    }
    case 'string': {
      return {
        type: issue.code,
        path: issue.path,
        message: `string must contain at most ${maxValueStr} character(s)`,
      };
    }
    case 'date': {
      return {
        type: issue.code,
        path: issue.path,
        message: `date must be ${
          issue.inclusive ? 'prior or equal to' : 'prior to'
        } "${maxValueStr}"`,
      };
    }
    case 'array': {
      return {
        type: issue.code,
        path: issue.path,
        message: `array must contain at most ${maxValueStr} item(s)`,
      };
    }
    case 'set': {
      return {
        type: issue.code,
        path: issue.path,
        message: `set must contain at most ${maxValueStr} item(s)`,
      };
    }
    case 'file': {
      return {
        type: issue.code,
        path: issue.path,
        message: `file must not exceed ${maxValueStr} byte(s) in size`,
      };
    }
    default:
      return {
        type: issue.code,
        path: issue.path,
        message: `value must be less than${
          issue.inclusive ? ' or equal to' : ''
        } ${maxValueStr}`,
      };
  }
}
