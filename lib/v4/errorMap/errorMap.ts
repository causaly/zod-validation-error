import { parseCustomIssue } from './custom.ts';
import { parseInvalidElementIssue } from './invalidElement.ts';
import { parseInvalidKeyIssue } from './invalidKey.ts';
import { parseInvalidStringFormatIssue } from './invalidStringFormat.ts';
import { parseInvalidTypeIssue } from './invalidType.ts';
import { parseInvalidUnionIssue } from './invalidUnion.ts';
import { parseInvalidValueIssue } from './invalidValue.ts';
import { parseNotMultipleOfIssue } from './notMultipleOf.ts';
import { parseTooBigIssue } from './tooBig.ts';
import { parseTooSmallIssue } from './tooSmall.ts';
import { parseUnrecognizedKeysIssue } from './unrecognizedKeys.ts';
import type {
  AbstractSyntaxTree,
  ErrorMapOptions,
  IssueType,
} from './types.ts';
import type * as zod from 'zod/v4/core';

type IssueParsers = {
  [IssueCode in IssueType]: (
    issue: zod.$ZodRawIssue<Extract<zod.$ZodIssue, { code: IssueCode }>>,
    options: ErrorMapOptions
  ) => AbstractSyntaxTree;
};

const issueParsers: IssueParsers = {
  invalid_type: parseInvalidTypeIssue,
  too_big: parseTooBigIssue,
  too_small: parseTooSmallIssue,
  invalid_format: parseInvalidStringFormatIssue,
  invalid_value: parseInvalidValueIssue,
  invalid_element: parseInvalidElementIssue,
  not_multiple_of: parseNotMultipleOfIssue,
  unrecognized_keys: parseUnrecognizedKeysIssue,
  invalid_key: parseInvalidKeyIssue,
  custom: parseCustomIssue,
  invalid_union: parseInvalidUnionIssue,
};

export const defaultErrorMapOptions = {
  displayInvalidFormatDetails: false,
  allowedValuesSeparator: ', ',
  allowedValuesLastSeparator: ' or ',
  wrapAllowedValuesInQuote: true,
  maxAllowedValuesToDisplay: 10,
  unrecognizedKeysSeparator: ', ',
  unrecognizedKeysLastSeparator: ' and ',
  wrapUnrecognizedKeysInQuote: true,
  maxUnrecognizedKeysToDisplay: 5,
  dateLocalization: true,
  numberLocalization: true,
} as const satisfies ErrorMapOptions;

export function createErrorMap(
  partialOptions: Partial<ErrorMapOptions> = {}
): zod.$ZodErrorMap<zod.$ZodIssue> {
  // fill-in default options
  const options = {
    ...defaultErrorMapOptions,
    ...partialOptions,
  };

  const errorMap: zod.$ZodErrorMap<zod.$ZodIssue> = (issue) => {
    if (issue.code === undefined) {
      // TODO: handle this case
      return 'Not supported issue type';
    }

    const parseFunc = issueParsers[issue.code] as (
      iss: typeof issue,
      opts: ErrorMapOptions
    ) => AbstractSyntaxTree;
    const ast = parseFunc(issue, options);
    return ast.message;
  };

  return errorMap;
}
