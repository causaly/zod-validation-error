import { joinPath } from '../../utils/joinPath.ts';
import { isNonEmptyArray } from '../../utils/NonEmptyArray.ts';
import { titleCase } from '../../utils/titleCase.ts';
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

const BRAND = Symbol.for('zod-validation-error-map');

const issueParsers: Record<
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

function parseInvalidUnionIssue(
  issue: zod.$ZodIssueInvalidUnion,
  options: ErrorMapOptions
): AbstractSyntaxTree {
  const errorMap = createErrorMap(options);

  const individualMessages = issue.errors.map((issues) =>
    issues
      .map((subIssue) =>
        errorMap({
          ...subIssue,
          path: issue.path.concat(subIssue.path),
        })
      )
      .join(options.issueSeparator)
  );
  const message = Array.from(new Set(individualMessages)).join(
    options.unionSeparator
  );

  return {
    type: issue.code,
    path: [],
    message,
  };
}

export const defaultErrorMapOptions = {
  includePath: true,
  unionSeparator: ' or ',
  issueSeparator: '; ',
  displayInvalidFormatDetails: false,
  allowedValuesSeparator: ', ',
  allowedValuesLastSeparator: ' or ',
  wrapAllowedValuesInQuote: true,
  maxAllowedValuesToDisplay: 10,
  unrecognizedKeysSeparator: ', ',
  unrecognizedKeysLastSeparator: ' and ',
  wrapUnrecognizedKeysInQuote: true,
  maxUnrecognizedKeysToDisplay: 5,
  issuesInTitleCase: true,
  dateLocalization: true,
  numberLocalization: true,
} as const satisfies ErrorMapOptions;

function equalsDefaultOptions(
  options: ErrorMapOptions
): options is typeof defaultErrorMapOptions {
  for (const key in options) {
    if (
      options[key as keyof ErrorMapOptions] !==
      defaultErrorMapOptions[key as keyof typeof defaultErrorMapOptions]
    ) {
      return false;
    }
  }

  return true;
}

function makeErrorMap(
  options: ErrorMapOptions
): zod.$ZodErrorMap<zod.$ZodIssue> {
  const errorMap: zod.$ZodErrorMap<zod.$ZodIssue> = (issue) => {
    if (issue.code === undefined) {
      // TODO: handle this case
      return 'Not supported issue type';
    }

    const parseFunc = issueParsers[issue.code];
    const ast = parseFunc(issue, options);
    return toString(ast, options);
  };

  Object.defineProperty(errorMap, '_brand', {
    value: BRAND,
    writable: false,
    enumerable: false,
    configurable: false,
  });

  return errorMap;
}

export const defaultErrorMap = makeErrorMap(defaultErrorMapOptions);

export function createErrorMap(
  partialOptions: Partial<ErrorMapOptions> = {}
): zod.$ZodErrorMap<zod.$ZodIssue> {
  // fill-in default options
  const options = {
    ...defaultErrorMapOptions,
    ...partialOptions,
  };

  if (equalsDefaultOptions(options)) {
    // If options are equal to default, return the default error map
    return defaultErrorMap;
  }

  return makeErrorMap(options);
}

function toString(ast: AbstractSyntaxTree, options: ErrorMapOptions): string {
  const buf = [];

  if (options.issuesInTitleCase) {
    buf.push(titleCase(ast.message));
  } else {
    buf.push(ast.message);
  }

  pathCondition: if (
    options.includePath &&
    ast.path !== undefined &&
    isNonEmptyArray(ast.path)
  ) {
    // handle array indices
    if (ast.path.length === 1) {
      const identifier = ast.path[0];

      if (typeof identifier === 'number') {
        buf.push(` at index ${identifier}`);
        break pathCondition;
      }
    }

    buf.push(` at "${joinPath(ast.path)}"`);
  }

  return buf.join('');
}

export function isZodValidationErrorMap(
  errorMap: zod.$ZodErrorMap<zod.$ZodIssue>
): boolean {
  return '_brand' in errorMap && errorMap._brand === BRAND;
}
