import { ISSUE_SEPARATOR, MAX_ENUM_VALUES, UNION_SEPARATOR } from './config.ts';
import { isNonEmptyArray } from './utils/NonEmptyArray.ts';
import { joinArrayOfStrings } from './utils/joinArrayOfStrings.ts';
import { joinPath } from './utils/joinPath.ts';
import type { NonEmptyArray } from './utils/NonEmptyArray.ts';
import type * as zod from 'zod';

export type ErrorMapOptions = {
  issueSeparator?: string;
  unionSeparator?: string;
  includePath?: boolean;
  maxEnumValues?: number;
};

export function makeErrorMap(
  options: ErrorMapOptions | undefined = {}
): zod.ZodErrorMap {
  const {
    issueSeparator = ISSUE_SEPARATOR,
    unionSeparator = UNION_SEPARATOR,
    maxEnumValues = MAX_ENUM_VALUES,
    includePath = true,
  } = options;

  return (issue, ctx) => {
    return mapIssue(issue, {
      issueSeparator,
      unionSeparator,
      maxEnumValues,
      includePath,
      defaultError: ctx.defaultError,
    });
  };
}

function mapIssue(
  issue: zod.ZodIssueOptionalMessage,
  options: Required<ErrorMapOptions> & { defaultError: string }
): {
  message: string;
} {
  switch (issue.code) {
    case 'invalid_enum_value':
      return mapInvalidEnumValueIssue(issue, options);
    case 'invalid_literal':
      return mapInvalidLiteralIssue(issue, options);
    case 'invalid_type':
      return mapInvalidTypeIssue(issue, options);
    case 'invalid_union':
      return mapInvalidUnionIssue(issue, options);
    default:
      return { message: options.defaultError };
  }
}

function mapInvalidLiteralIssue(
  issue: zod.ZodInvalidLiteralIssue,
  options: {
    includePath: boolean;
  }
): { message: string } {
  const expected = JSON.stringify(issue.expected);
  const received = JSON.stringify(issue.received);

  const atPath = getPathOrEmptyString(issue, options);

  return {
    message: `Invalid literal value${atPath} - expected ${expected}, received ${received}`,
  };
}

function mapInvalidEnumValueIssue(
  issue: zod.ZodInvalidEnumValueIssue,
  options: {
    maxEnumValues: number;
    includePath: boolean;
  }
): { message: string } {
  const expectedEnumValues = issue.options
    // take only the first `maxEnumValues` values
    .slice(0, options.maxEnumValues)
    // format values
    .map((value) => JSON.stringify(value));

  // is there more values than `maxEnumValues`?
  const diff = issue.options.length - options.maxEnumValues;
  if (diff > 0) {
    expectedEnumValues.push(`${diff} more value${diff > 1 ? 's' : ''}`);
  }

  const expected = joinArrayOfStrings(expectedEnumValues, {
    separator: ', ',
    lastSeparator: ` or `,
  });
  const received = JSON.stringify(issue.received);

  const atPath = getPathOrEmptyString(issue, options);

  return {
    message: `Invalid enum value${atPath} - expected ${expected}, received ${received}`,
  };
}

export function mapInvalidTypeIssue(
  issue: zod.ZodInvalidTypeIssue,
  options: {
    includePath: boolean;
  }
): { message: string } {
  const atPath = getPathOrEmptyString(issue, options);
  return {
    message: `Invalid type${atPath} - expected ${issue.expected}, received ${issue.received}`,
  };
}

function mapInvalidUnionIssue(
  issue: zod.ZodInvalidUnionIssue,
  options: Required<ErrorMapOptions>
): { message: string } {
  const issuesByCode = groupIssuesByCode(
    issue.unionErrors.flatMap((error) => error.issues)
  );
  const errorMessage = formatGroupedIssuesByCode(issuesByCode, options);
  const atPath = getPathOrEmptyString(issue, options);

  return {
    message: `Invalid union${atPath} - ${errorMessage}`,
  };
}

function formatGroupedIssuesByCode(
  issuesByCode: Map<zod.ZodIssueCode, Array<zod.ZodIssue>>,
  options: Required<ErrorMapOptions>
): string {
  const acc = new Array<string>();

  for (const [code, issues] of issuesByCode) {
    switch (code) {
      case 'invalid_type': {
        acc.push(
          formatInvalidTypeIssueUnion(
            issues as NonEmptyArray<zod.ZodInvalidTypeIssue>
          )
        );
        break;
      }
      default: {
        for (const issue of issues) {
          const { message } = mapIssue(issue, {
            ...options,
            defaultError: issue.message,
          });
          acc.push(message);
        }
      }
    }
  }

  return acc.join(options.unionSeparator);
}

function formatInvalidTypeIssueUnion(
  issues: NonEmptyArray<zod.ZodInvalidTypeIssue>
): string {
  const expected = joinArrayOfStrings(
    Array.from(new Set(issues.map((issue) => issue.expected))),
    {
      separator: ', ',
      lastSeparator: ` or `,
    }
  );

  // received is the same for all issues
  const received = issues[0].received;

  return `expected ${expected}, received ${received}`;
}

function groupIssuesByCode(
  issues: Array<zod.ZodIssue>
): Map<zod.ZodIssueCode, Array<zod.ZodIssue>> {
  const issuesByCode = new Map<zod.ZodIssueCode, NonEmptyArray<zod.ZodIssue>>();

  for (const issue of issues) {
    const group = issuesByCode.get(issue.code);

    if (!group) {
      issuesByCode.set(issue.code, [issue]);
      continue;
    }

    group.push(issue);
  }

  return issuesByCode;
}

function getPathOrEmptyString(
  issue: zod.ZodIssueBase,
  options: {
    includePath: boolean;
  }
): string {
  if (options.includePath && isNonEmptyArray(issue.path)) {
    // handle array indices
    if (issue.path.length === 1) {
      const identifier = issue.path[0];

      if (typeof identifier === 'number') {
        return ` at index ${identifier}`;
      }
    }

    return ` at ${joinPath(issue.path)}`;
  }

  return '';
}
