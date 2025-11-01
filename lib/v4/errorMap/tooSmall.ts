import { stringify } from '../../utils/stringify.ts';
import { isPrimitive } from '../../utils/isPrimitive.ts';
import type * as zod from 'zod/v4/core';
import type { AbstractSyntaxTree, ErrorMapOptions } from './types.ts';

export function parseTooSmallIssue(
  issue: zod.$ZodRawIssue<zod.$ZodIssueTooSmall>,
  options: Pick<
    ErrorMapOptions,
    'dateLocalization' | 'numberLocalization' | 'reportInput'
  >
): AbstractSyntaxTree {
  const minValueStr =
    issue.origin === 'date'
      ? stringify(new Date(issue.minimum as number), {
          localization: options.dateLocalization,
        })
      : stringify(issue.minimum, {
          localization: options.numberLocalization,
        });
  let message = '';

  switch (issue.origin) {
    case 'number':
    case 'int':
    case 'bigint': {
      message += `expected number to be greater than${
        issue.inclusive ? ' or equal to' : ''
      } ${minValueStr}`;
      break;
    }
    case 'date': {
      message += `expected date to be ${
        issue.inclusive ? 'later or equal to' : 'later to'
      } "${minValueStr}"`;
      break;
    }
    case 'string': {
      message += `expected string to contain at least ${minValueStr} character(s)`;
      break;
    }
    case 'array': {
      message += `expected array to contain at least ${minValueStr} item(s)`;
      break;
    }
    case 'set': {
      message += `expected set to contain at least ${minValueStr} item(s)`;
      break;
    }
    case 'file': {
      message += `expected file to be at least ${minValueStr} byte(s) in size`;
      break;
    }
    default:
      message += `expected value to be greater than${
        issue.inclusive ? ' or equal to' : ''
      } ${minValueStr}`;
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
