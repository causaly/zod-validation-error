import { joinPath } from '../utils/joinPath.ts';
import { joinValues } from '../utils/joinValues.ts';
import { isNonEmptyArray } from '../utils/NonEmptyArray.ts';
import { stringifyValue } from '../utils/stringify.ts';
import type * as zod from 'zod/v4/core';

export type IssueType = NonNullable<zod.$ZodIssue['code']>;

type AbstractSyntaxTree = {
  type: IssueType;
  claim: string;
  path?: zod.$ZodIssue['path'];
  expectation?: string;
  realization?: string;
};

export type ErrorMapOptions = {
  includePath: boolean;
  displayInvalidFormatDetails: boolean;
  valuesSeparator: string;
  valuesLastSeparator: string | undefined;
  wrapStringValuesInQuote: boolean;
  maxValuesToDisplay: number;
  errorDetails?: {
    disabled?: boolean;
    prefix?: string;
    suffix?: string;
  };
};

export const defaultErrorMapOptions: ErrorMapOptions = {
  includePath: true,
  displayInvalidFormatDetails: false,
  valuesSeparator: ', ',
  valuesLastSeparator: ' or ',
  wrapStringValuesInQuote: true,
  maxValuesToDisplay: 5,
};

const issueParsers: Record<
  IssueType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (issue: any, options: ErrorMapOptions) => AbstractSyntaxTree
> = {
  invalid_type: parseInvalidTypeIssue,
  too_big: parseTooBigIssue,
  too_small: parseTooSmallIssue,
  invalid_format: parseInvalidStringFormatIssue,
  invalid_value: parseInvalidValue,
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
    }
    if (ast.realization) {
      buf.push(', ', ast.realization);
    }
    buf.push(errorDetails.suffix ?? '');
  }

  return buf.join('');
}

//   | z.core.$ZodIssueNotMultipleOf
//   | z.core.$ZodIssueUnrecognizedKeys
//   | z.core.$ZodIssueInvalidValue
//   | z.core.$ZodIssueInvalidUnion
//   | z.core.$ZodIssueInvalidKey // new: used for z.record/z.map
//   | z.core.$ZodIssueInvalidElement // new: used for z.map/z.set
//   | z.core.$ZodIssueCustom;

// | z.ZodInvalidEnumValueIssue // ❌ merged in z.core.$ZodIssueInvalidValue
//   | z.ZodInvalidLiteralIssue // ❌ merged into z.core.$ZodIssueInvalidValue
//   | z.ZodInvalidUnionDiscriminatorIssue // ❌ throws an Error at schema creation time
//   | z.ZodInvalidArgumentsIssue // ❌ z.function throws ZodError directly
//   | z.ZodInvalidReturnTypeIssue // ❌ z.function throws ZodError directly
//   | z.ZodInvalidDateIssue // ❌ merged into invalid_type
//   | z.ZodInvalidIntersectionTypesIssue // ❌ removed (throws regular Error)
//   | z.ZodNotFiniteIssue // ❌ infinite values no longer accepted (invalid_type)

function parseInvalidTypeIssue(
  issue: zod.$ZodIssueInvalidType
): AbstractSyntaxTree {
  return {
    type: issue.code,
    path: issue.path,
    claim: 'invalid type',
    expectation: `expected ${issue.expected}`,
    realization: compileTypeRealization(issue),
  };
}

function parseTooBigIssue(issue: zod.$ZodIssueTooBig): AbstractSyntaxTree {
  switch (issue.origin) {
    case 'number':
    case 'int':
    case 'bigint': {
      return {
        type: issue.code,
        path: issue.path,
        claim: 'number too big',
        expectation: `expected <${
          issue.inclusive ? '=' : ''
        } ${issue.maximum.toLocaleString()}`,
        realization: compileNumericValueRealization(issue),
      };
    }
    case 'date': {
      return {
        type: issue.code,
        path: issue.path,
        claim: 'invalid date',
        expectation: `expected ${
          issue.inclusive ? 'prior or equal to' : 'prior to'
        } ${new Date(issue.maximum as number).toLocaleString()}`,
      };
    }
    case 'string': {
      return {
        type: issue.code,
        path: issue.path,
        claim: 'string contains too many characters',
        expectation: `expected <${
          issue.inclusive ? '=' : ''
        } ${issue.maximum.toLocaleString()} character${
          issue.maximum === 1 ? '' : 's'
        }`,
        realization: compileCharacterLengthRealization(issue),
      };
    }
    case 'array': {
      return {
        type: issue.code,
        path: issue.path,
        claim: 'array contains too many items',
        expectation: `expected <${
          issue.inclusive ? '=' : ''
        } ${issue.maximum.toLocaleString()} in size`,
        realization: compileArraySizeRealization(issue),
      };
    }
    case 'set': {
      return {
        type: issue.code,
        path: issue.path,
        claim: 'set contains too many items',
        expectation: `expected <${
          issue.inclusive ? '=' : ''
        } ${issue.maximum.toLocaleString()} in size`,
        realization: compileSetSizeRealization(issue),
      };
    }
    case 'file': {
      return {
        type: issue.code,
        path: issue.path,
        claim: 'file is too large in size',
        expectation: `expected <${
          issue.inclusive ? '=' : ''
        } ${issue.maximum.toLocaleString()} byte${
          issue.maximum === 1 ? '' : 's'
        }`,
        realization: compileFileSizeRealization(issue),
      };
    }
    default:
      return {
        type: issue.code,
        path: issue.path,
        claim: 'invalid value',
        expectation: `expected <${
          issue.inclusive ? '=' : ''
        } ${issue.maximum.toLocaleString()}`,
      };
  }
}

function parseTooSmallIssue(issue: zod.$ZodIssueTooSmall): AbstractSyntaxTree {
  switch (issue.origin) {
    case 'number':
    case 'int':
    case 'bigint': {
      return {
        type: issue.code,
        path: issue.path,
        claim: 'number is too small',
        expectation: `expected >${
          issue.inclusive ? '=' : ''
        } ${issue.minimum.toLocaleString()}`,
        realization: compileNumericValueRealization(issue),
      };
    }
    case 'date': {
      return {
        type: issue.code,
        path: issue.path,
        claim: 'invalid date',
        expectation: `expected ${
          issue.inclusive ? 'later or equal to' : 'later to'
        } ${new Date(issue.minimum as number).toLocaleString()}`,
      };
    }
    case 'string': {
      return {
        type: issue.code,
        path: issue.path,
        claim: 'string is too short',
        expectation: `expected >${
          issue.inclusive ? '=' : ''
        } ${issue.minimum.toLocaleString()} character${
          issue.minimum === 1 ? '' : 's'
        }`,
        realization: compileCharacterLengthRealization(issue),
      };
    }
    case 'array': {
      return {
        type: issue.code,
        path: issue.path,
        claim: 'array contains too few items',
        expectation: `expected >${
          issue.inclusive ? '=' : ''
        } ${issue.minimum.toLocaleString()} in size`,
        realization: compileArraySizeRealization(issue),
      };
    }
    case 'set': {
      return {
        type: issue.code,
        path: issue.path,
        claim: 'set contains too few items',
        expectation: `expected >${
          issue.inclusive ? '=' : ''
        } ${issue.minimum.toLocaleString()} in size`,
        realization: compileSetSizeRealization(issue),
      };
    }
    case 'file': {
      return {
        type: issue.code,
        path: issue.path,
        claim: 'file is too small in size',
        expectation: `expected >${
          issue.inclusive ? '=' : ''
        } ${issue.minimum.toLocaleString()} byte${
          issue.minimum === 1 ? '' : 's'
        }`,
        realization: compileFileSizeRealization(issue),
      };
    }
    default:
      return {
        type: issue.code,
        path: issue.path,
        claim: 'invalid value',
        expectation: `expected >${
          issue.inclusive ? '=' : ''
        } ${issue.minimum.toLocaleString()}`,
      };
  }
}

function parseInvalidStringFormatIssue(
  issue: zod.$ZodIssueInvalidStringFormat,
  options: Pick<ErrorMapOptions, 'displayInvalidFormatDetails'> = {
    displayInvalidFormatDetails: false,
  }
): AbstractSyntaxTree {
  let expectation: string;

  switch (issue.format) {
    case 'lowercase':
    case 'uppercase': {
      expectation = `expected all characters to be in ${issue.format} format`;
      break;
    }
    default: {
      if (isZodIssueStringStartsWith(issue)) {
        return parseStringStartsWith(issue);
      }
      if (isZodIssueStringEndsWith(issue)) {
        return parseStringEndsWith(issue);
      }
      if (isZodIssueStringIncludes(issue)) {
        return parseStringIncludes(issue);
      }
      if (isZodIssueStringInvalidRegex(issue)) {
        return parseStringInvalidRegex(issue, options);
      }
      if (isZodIssueStringInvalidJWT(issue)) {
        return parseStringInvalidJWT(issue, options);
      }

      expectation = `expected ${issue.format} format`;
    }
  }

  return {
    type: issue.code,
    path: issue.path,
    claim: 'malformed value',
    expectation,
  };
}

function isZodIssueStringStartsWith(
  issue: zod.$ZodIssueInvalidStringFormat
): issue is zod.$ZodIssueStringStartsWith {
  return issue.format === 'starts_with';
}

function parseStringStartsWith(
  issue: zod.$ZodIssueStringStartsWith
): AbstractSyntaxTree {
  return {
    type: issue.code,
    path: issue.path,
    claim: 'malformed value',
    expectation: `should start with "${issue.prefix}"`,
  };
}

function isZodIssueStringEndsWith(
  issue: zod.$ZodIssueInvalidStringFormat
): issue is zod.$ZodIssueStringEndsWith {
  return issue.format === 'ends_with';
}

function parseStringEndsWith(
  issue: zod.$ZodIssueStringEndsWith
): AbstractSyntaxTree {
  return {
    type: issue.code,
    path: issue.path,
    claim: 'malformed value',
    expectation: `should end with "${issue.suffix}"`,
  };
}

function isZodIssueStringIncludes(
  issue: zod.$ZodIssueInvalidStringFormat
): issue is zod.$ZodIssueStringIncludes {
  return issue.format === 'includes';
}

function parseStringIncludes(
  issue: zod.$ZodIssueStringIncludes
): AbstractSyntaxTree {
  return {
    type: issue.code,
    path: issue.path,
    claim: 'malformed value',
    expectation: `should include "${issue.includes}"`,
  };
}

function isZodIssueStringInvalidRegex(
  issue: zod.$ZodIssueInvalidStringFormat
): issue is zod.$ZodIssueStringInvalidRegex {
  return issue.format === 'regex';
}

function parseStringInvalidRegex(
  issue: zod.$ZodIssueStringInvalidRegex,
  options: Pick<ErrorMapOptions, 'displayInvalidFormatDetails'> = {
    displayInvalidFormatDetails: false,
  }
): AbstractSyntaxTree {
  return {
    type: issue.code,
    path: issue.path,
    claim: 'malformed value',
    expectation: options.displayInvalidFormatDetails
      ? `should match pattern "${issue.pattern}"`
      : `does not match expected pattern`,
  };
}

function isZodIssueStringInvalidJWT(
  issue: zod.$ZodIssueInvalidStringFormat
): issue is zod.$ZodIssueStringInvalidJWT {
  return issue.format === 'jwt';
}

function parseStringInvalidJWT(
  issue: zod.$ZodIssueStringInvalidJWT,
  options: Pick<ErrorMapOptions, 'displayInvalidFormatDetails'> = {
    displayInvalidFormatDetails: false,
  }
): AbstractSyntaxTree {
  return {
    type: issue.code,
    path: issue.path,
    claim: 'malformed value',
    expectation:
      options.displayInvalidFormatDetails && issue.algorithm
        ? `expected jwt (${issue.algorithm}) format`
        : `expected jwt format`,
  };
}

function parseInvalidValue(
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

// export interface $ZodIssueStringInvalidJWT extends $ZodIssueInvalidStringFormat {
//     format: "jwt";
//     algorithm?: string;
// }

function compileTypeRealization(issue: zod.$ZodIssue): string | undefined {
  if (!('input' in issue)) {
    return undefined;
  }

  return `received ${typeof issue.input}`;
}

function compileNumericValueRealization(
  issue: zod.$ZodIssue
): string | undefined {
  switch (typeof issue.input) {
    case 'number':
    case 'bigint':
      return `received ${issue.input.toLocaleString()}`;
    default:
      return undefined;
  }
}

function compileCharacterLengthRealization(
  issue: zod.$ZodIssue
): string | undefined {
  switch (typeof issue.input) {
    case 'string':
      return `received ${issue.input.length.toLocaleString()} character${
        issue.input.length === 1 ? '' : 's'
      }`;
    default:
      return undefined;
  }
}

function compileArraySizeRealization(issue: zod.$ZodIssue): string | undefined {
  if (Array.isArray(issue.input)) {
    return `received ${issue.input.length.toLocaleString()} item${
      issue.input.length === 1 ? '' : 's'
    }`;
  }

  return undefined;
}

function compileSetSizeRealization(issue: zod.$ZodIssue): string | undefined {
  if (issue.input instanceof Set) {
    return `received ${issue.input.size.toLocaleString()} item${
      issue.input.size === 1 ? '' : 's'
    }`;
  }

  return undefined;
}

function compileFileSizeRealization(issue: zod.$ZodIssue): string | undefined {
  if (issue.input instanceof File) {
    return `received ${issue.input.size.toLocaleString()} byte${
      issue.input.size === 1 ? '' : 's'
    }`;
  }

  return undefined;
}
