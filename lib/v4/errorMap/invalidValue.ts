import { joinValues } from '../../utils/joinValues.ts';
import { stringifyValue } from '../../utils/stringify.ts';
import type { AbstractSyntaxTree, ErrorMapOptions } from './types.ts';
import type * as zod from 'zod/v4/core';

export function parseInvalidValueIssue(
  issue: zod.$ZodIssueInvalidValue,
  options: Pick<
    ErrorMapOptions,
    | 'valuesSeparator'
    | 'wrapStringValuesInQuote'
    | 'maxValuesToDisplay'
    | 'valuesLastSeparator'
  >
): AbstractSyntaxTree {
  let expectation: string | undefined;

  if (issue.values.length === 0) {
    expectation = undefined;
  } else if (issue.values.length === 1) {
    const valueStr = stringifyValue(issue.values[0], {
      wrapStringsInQuote: true,
    });
    expectation = `expected ${valueStr}`;
  } else {
    const valuesStr = joinValues(issue.values, {
      separator: options.valuesSeparator,
      lastSeparator: options.valuesLastSeparator,
      wrapStringsInQuote: options.wrapStringValuesInQuote,
      maxValuesToDisplay: options.maxValuesToDisplay,
    });
    expectation = `expected one of ${valuesStr}`;
  }

  return {
    type: issue.code,
    path: issue.path,
    claim: 'invalid value',
    expectation: expectation,
  };
}
