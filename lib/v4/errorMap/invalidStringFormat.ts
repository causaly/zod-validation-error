import { prependWithAOrAn } from '../../utils/prependWithAOrAn.ts';
import { stringify } from '../../utils/stringify.ts';
import type * as zod from 'zod/v4/core';
import type { AbstractSyntaxTree, ErrorMapOptions } from './types.ts';

export function parseInvalidStringFormatIssue(
  issue: zod.$ZodRawIssue<zod.$ZodIssueInvalidStringFormat>,
  options: Pick<
    ErrorMapOptions,
    'displayInvalidFormatDetails' | 'reportInput' | 'numberLocalization'
  >
): AbstractSyntaxTree {
  let message = '';

  switch (issue.format) {
    case 'lowercase':
    case 'uppercase':
      message += `expected string to be in ${issue.format} format`;
      break;
    case 'starts_with': {
      message += `expected string to start with "${issue.prefix}"`;
      break;
    }
    case 'ends_with': {
      message += `expected string to end with "${issue.suffix}"`;
      break;
    }
    case 'includes': {
      message += `expected string to include "${issue.includes}"`;
      break;
    }
    case 'regex': {
      message += 'expected string to match pattern';
      if (options.displayInvalidFormatDetails) {
        message += ` "${issue.pattern}"`;
      }
      break;
    }
    case 'jwt': {
      message += 'expected string to be a jwt';
      if (options.displayInvalidFormatDetails && issue.algorithm) {
        message += `/${issue.algorithm}`;
      }
      message += ' token';
      break;
    }
    case 'email': {
      message += 'expected string to be an email address';
      break;
    }
    default: {
      message += `expected string to be ${prependWithAOrAn(issue.format)}`;
    }
  }

  if ('input' in issue && options.reportInput === 'typeAndValue') {
    const valueStr = stringify(issue.input, {
      wrapStringValueInQuote: true,
      localization: options.numberLocalization,
    });
    message += `, received ${valueStr}`;
  }

  return {
    type: issue.code,
    path: issue.path,
    message,
  };
}
