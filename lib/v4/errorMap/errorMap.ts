import { joinPath } from '../../utils/joinPath.ts';
import { isNonEmptyArray } from '../../utils/NonEmptyArray.ts';
import { issueParsers } from './issueParsers.ts';
import type * as zod from 'zod/v4/core';
import type { AbstractSyntaxTree, ErrorMapOptions } from './types.ts';

export const defaultErrorMapOptions: ErrorMapOptions = {
  includePath: true,
  displayInvalidFormatDetails: false,
  valuesSeparator: ', ',
  valuesLastSeparator: ' or ',
  wrapStringValuesInQuote: true,
  maxValuesToDisplay: 5,
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
