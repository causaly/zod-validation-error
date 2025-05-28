import { joinPath } from '../../utils/joinPath.ts';
import { isNonEmptyArray } from '../../utils/NonEmptyArray.ts';
import { parseInvalidElementIssue } from './invalidElement.ts';
import { parseInvalidStringFormatIssue } from './invalidStringFormat.ts';
import { parseInvalidTypeIssue } from './invalidType.ts';
import { parseInvalidValueIssue } from './invalidValue.ts';
import { parseNotMultipleOfIssue } from './notMultipleOf.ts';
import { parseTooBigIssue } from './tooBig.ts';
import { parseTooSmallIssue } from './tooSmall.ts';
import { parseUnrecognizedKeysIssue } from './unrecognizedKeys.ts';
import { parseInvalidKeyIssue } from './invalidKey.ts';
import { parseCustomIssue } from './custom.ts';
import type {
  IssueType,
  ErrorMapOptions,
  AbstractSyntaxTree,
} from './types.ts';
import type * as zod from 'zod/v4/core';

export const issueParsers: Record<
  IssueType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (issue: any, options: ErrorMapOptions) => AbstractSyntaxTree
> = {
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

export function parseInvalidUnionIssue(
  issue: zod.$ZodIssueInvalidUnion,
  options: ErrorMapOptions
): AbstractSyntaxTree {
  const errorMap = createErrorMap(options);
  const claim = issue.errors
    .reduce<string[]>((acc, issues) => {
      const newIssues = issues.map(errorMap).join(options.issueSeparator);

      if (!acc.includes(newIssues)) {
        acc.push(newIssues);
      }

      return acc;
    }, [])
    .join(options.unionSeparator);

  return {
    type: issue.code,
    path: issue.path,
    claim,
  };
}

export const defaultErrorMapOptions: ErrorMapOptions = {
  includePath: true,
  displayInvalidFormatDetails: false,
  valuesSeparator: ', ',
  valuesLastSeparator: ' or ',
  wrapStringValuesInQuote: true,
  maxValuesToDisplay: 10,
  unrecognizedKeysSeparator: ', ',
  unrecognizedKeysLastSeparator: ' and ',
  wrapUnrecognizedKeysInQuote: true,
  maxUnrecognizedKeysToDisplay: 5,
  issueSeparator: '; ',
  unionSeparator: ', or ',
};

export function createErrorMap(
  options: Partial<ErrorMapOptions> = {}
): zod.$ZodErrorMap<zod.$ZodIssue> {
  // fill-in default options
  const refinedOptions = {
    ...defaultErrorMapOptions,
    ...options,
  };

  const errorMap: zod.$ZodErrorMap<zod.$ZodIssue> = (issue) => {
    if (issue.code === undefined) {
      // TODO: handle this case
      return 'Not supported issue type';
    }

    const parseFunc = issueParsers[issue.code];
    const ast = parseFunc(issue, refinedOptions);
    return toString(ast, refinedOptions);
  };

  return errorMap;
}

function toString(ast: AbstractSyntaxTree, options: ErrorMapOptions): string {
  const errorDetails = options.errorDetails ?? {};

  const buf = [ast.claim];

  if (
    options.includePath &&
    ast.path !== undefined &&
    isNonEmptyArray(ast.path)
  ) {
    buf.push(` at "${joinPath(ast.path)}"`);
  }

  if (!errorDetails.disabled) {
    buf.push(errorDetails.prefix ?? `; `);
    if (ast.expectation) {
      buf.push(ast.expectation);

      if (ast.realization) {
        buf.push(`, `);
      }
    }
    if (ast.realization) {
      buf.push(ast.realization);
    }
    buf.push(errorDetails.suffix ?? '');
  }

  return buf.join('');
}
