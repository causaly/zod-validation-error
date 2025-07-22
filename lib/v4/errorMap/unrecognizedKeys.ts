import { joinValues } from '../../utils/joinValues.ts';
import type * as zod from 'zod/v4/core';
import type { AbstractSyntaxTree, ErrorMapOptions } from './types.ts';

export function parseUnrecognizedKeysIssue(
  issue: zod.$ZodRawIssue<zod.$ZodIssueUnrecognizedKeys>,
  options: Pick<
    ErrorMapOptions,
    | 'unrecognizedKeysSeparator'
    | 'unrecognizedKeysLastSeparator'
    | 'wrapUnrecognizedKeysInQuote'
    | 'maxUnrecognizedKeysToDisplay'
  >
): AbstractSyntaxTree {
  const keysStr = joinValues(issue.keys, {
    separator: options.unrecognizedKeysSeparator,
    lastSeparator: options.unrecognizedKeysLastSeparator,
    wrapStringValuesInQuote: options.wrapUnrecognizedKeysInQuote,
    maxValuesToDisplay: options.maxUnrecognizedKeysToDisplay,
  });

  return {
    type: issue.code,
    path: issue.path,
    message: `unrecognized key(s) ${keysStr} in object`,
  };
}
