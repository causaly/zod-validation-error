import { joinValues } from '../../utils/joinValues.ts';
import { stringify } from '../../utils/stringify.ts';
import type { AbstractSyntaxTree, ErrorMapOptions } from './types.ts';
import type * as zod from 'zod/v4/core';

export function parseInvalidValueIssue(
  issue: zod.$ZodRawIssue<zod.$ZodIssueInvalidValue>,
  options: Pick<
    ErrorMapOptions,
    | 'allowedValuesSeparator'
    | 'maxAllowedValuesToDisplay'
    | 'wrapAllowedValuesInQuote'
    | 'allowedValuesLastSeparator'
  >
): AbstractSyntaxTree {
  let message: string;

  if (issue.values.length === 0) {
    message = 'invalid value';
  } else if (issue.values.length === 1) {
    const valueStr = stringify(issue.values[0], {
      wrapStringValueInQuote: true,
    });
    message = `expected value to be ${valueStr}`;
  } else {
    const valuesStr = joinValues(issue.values, {
      separator: options.allowedValuesSeparator,
      lastSeparator: options.allowedValuesLastSeparator,
      wrapStringValuesInQuote: options.wrapAllowedValuesInQuote,
      maxValuesToDisplay: options.maxAllowedValuesToDisplay,
    });
    message = `expected value to be one of ${valuesStr}`;
  }

  return {
    type: issue.code,
    path: issue.path,
    message,
  };
}
