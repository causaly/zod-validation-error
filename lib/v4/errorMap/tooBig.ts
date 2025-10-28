import { isPrimitive } from '../../utils/isPrimitive.ts';
import { stringify } from '../../utils/stringify.ts';
import type { AbstractSyntaxTree, ErrorMapOptions } from './types.ts';
import type * as zod from 'zod/v4/core';

export function parseTooBigIssue(
  issue: zod.$ZodRawIssue<zod.$ZodIssueTooBig>,
  options: Pick<
    ErrorMapOptions,
    'dateLocalization' | 'numberLocalization' | 'reportInput'
  >
): AbstractSyntaxTree {
  const maxValueStr =
    issue.origin === 'date'
      ? stringify(new Date(issue.maximum as number), {
          localization: options.dateLocalization,
        })
      : stringify(issue.maximum, {
          localization: options.numberLocalization,
        });

  let message = '';

  switch (issue.origin) {
    case 'number':
    case 'int':
    case 'bigint': {
      message += `expected number to be less than${
        issue.inclusive ? ' or equal to' : ''
      } ${maxValueStr}`;
      break;
    }
    case 'string': {
      message += `expected string to contain at most ${maxValueStr} character(s)`;
      break;
    }
    case 'date': {
      message += `expected date to be prior ${
        issue.inclusive ? 'or equal to' : 'to'
      } "${maxValueStr}"`;
      break;
    }
    case 'array': {
      message += `expected array to contain at most ${maxValueStr} item(s)`;
      break;
    }
    case 'set': {
      message += `expected set to contain at most ${maxValueStr} item(s)`;
      break;
    }
    case 'file': {
      message += `expected file to not exceed ${maxValueStr} byte(s) in size`;
      break;
    }
    default: {
      message += `expected value to be less than${
        issue.inclusive ? ' or equal to' : ''
      } ${maxValueStr}`;
    }
  }

  if ('input' in issue && options.reportInput === 'typeAndValue') {
    const value = issue.input;

    if (isPrimitive(value)) {
      const valueStr = stringify(value, {
        wrapStringValueInQuote: true,
        localization: options.numberLocalization,
      });
      message += `, received ${valueStr}`;
    } else if (value instanceof Date) {
      const valueStr = stringify(value, {
        localization: options.dateLocalization,
      });
      message += `, received ${valueStr}`;
    }
  }

  return {
    type: issue.code,
    path: issue.path,
    message,
  };
}
