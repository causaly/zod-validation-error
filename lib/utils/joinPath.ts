import { NonEmptyArray } from './NonEmptyArray';

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#identifiers
 */
const identifierRegex = /[$_\p{ID_Start}][$\u200c\u200d\p{ID_Continue}]*/u;

export function joinPath(path: NonEmptyArray<string | number>): string {
  if (path.length === 1) {
    return path[0].toString();
  }

  return path.reduce<string>((acc, item) => {
    // handle numeric indices
    if (typeof item === 'number') {
      return acc + '[' + item.toString() + ']';
    }

    // handle quoted values
    if (item.includes('"')) {
      return acc + '["' + escapeQuotes(item) + '"]';
    }

    // handle special characters
    if (!identifierRegex.test(item)) {
      return acc + '["' + item + '"]';
    }

    // handle normal values
    const separator = acc.length === 0 ? '' : '.';
    return acc + separator + item;
  }, '');
}

function escapeQuotes(str: string): string {
  return str.replace(/"/g, '\\"');
}
