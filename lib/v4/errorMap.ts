import { joinPath } from '../utils/joinPath.ts';
import { isNonEmptyArray } from '../utils/NonEmptyArray.ts';
import type * as zod from 'zod/v4/core';

export type IssueType = NonNullable<zod.$ZodIssue['code']>;

type AbstractSyntaxTree = {
  type: IssueType;
  claim: string;
  path?: zod.$ZodIssue['path'];
  expectation?: string;
  realization?: string;
};

// invalid type: expectation, realization

export type CreateErrorMapOptions = {
  errorDetails?: {
    disabled?: boolean;
    prefix?: string;
    suffix?: string;
  };
  includePath?: boolean;
  unionSeparator?: string;
};

const issueParsers: Record<IssueType, (issue: any) => AbstractSyntaxTree> = {
  invalid_type: parseInvalidTypeIssue,
  too_big: parseTooBigIssue,
  too_small: parseTooSmallIssue,
};

export function createErrorMap(
  options: CreateErrorMapOptions = {}
): zod.$ZodErrorMap<zod.$ZodIssue> {
  const errorMap: zod.$ZodErrorMap<zod.$ZodIssue> = (issue) => {
    if (issue.code === undefined) {
      // TODO: handle this case
      return 'Not supported issue type';
    }

    const parseFunc = issueParsers[issue.code];
    const ast = parseFunc(issue);
    return toString(ast, options);
  };

  return errorMap;
}

function toString(
  ast: AbstractSyntaxTree,
  options: CreateErrorMapOptions
): string {
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

// | z.core.$ZodIssueInvalidStringFormat
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
