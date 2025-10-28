import { stringify } from '../../utils/stringify.ts';
import type * as zod from 'zod/v4/core';
import type { AbstractSyntaxTree, ErrorMapOptions } from './types.ts';

export function parseNotMultipleOfIssue(
  issue: zod.$ZodRawIssue<zod.$ZodIssueNotMultipleOf>,
  options: Pick<ErrorMapOptions, 'reportInput' | 'numberLocalization'>
): AbstractSyntaxTree {
  let message = `expected multiple of ${issue.divisor}`;

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
