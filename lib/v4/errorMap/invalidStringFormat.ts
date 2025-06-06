import type { AbstractSyntaxTree, ErrorMapOptions } from './types.ts';
import type * as zod from 'zod/v4/core';

export function parseInvalidStringFormatIssue(
  issue: zod.$ZodIssueInvalidStringFormat,
  options: Pick<ErrorMapOptions, 'displayInvalidFormatDetails'> = {
    displayInvalidFormatDetails: false,
  }
): AbstractSyntaxTree {
  switch (issue.format) {
    case 'lowercase':
    case 'uppercase':
      return {
        type: issue.code,
        path: issue.path,
        message: `value must be in ${issue.format} format`,
      };
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

      return {
        type: issue.code,
        path: issue.path,
        message: `invalid ${issue.format}`,
      };
    }
  }
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
    message: `value must start with "${issue.prefix}"`,
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
    message: `value must end with "${issue.suffix}"`,
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
    message: `value must include "${issue.includes}"`,
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
  let message = 'value must match pattern';
  if (options.displayInvalidFormatDetails) {
    message += ` "${issue.pattern}"`;
  }

  return {
    type: issue.code,
    path: issue.path,
    message,
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
    message:
      options.displayInvalidFormatDetails && issue.algorithm
        ? `invalid jwt/${issue.algorithm}`
        : `invalid jwt`,
  };
}
