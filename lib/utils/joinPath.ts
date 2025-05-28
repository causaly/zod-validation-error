import { stringifySymbol } from './stringify.ts';
import type { NonEmptyArray } from './NonEmptyArray.ts';

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#identifiers
 */
const identifierRegex = /[$_\p{ID_Start}][$\u200c\u200d\p{ID_Continue}]*/u;

export function joinPath(path: NonEmptyArray<PropertyKey>): string {
  if (path.length === 1) {
    let propertyKey = path[0];

    if (typeof propertyKey === 'symbol') {
      propertyKey = stringifySymbol(propertyKey);
    }

    return propertyKey.toString() || '""';
  }

  return path.reduce<string>((acc, propertyKey) => {
    // handle numeric indices
    if (typeof propertyKey === 'number') {
      return acc + '[' + propertyKey.toString() + ']';
    }

    // handle symbols
    if (typeof propertyKey === 'symbol') {
      propertyKey = stringifySymbol(propertyKey);
    }

    // handle quoted values
    if (propertyKey.includes('"')) {
      return acc + '["' + escapeQuotes(propertyKey) + '"]';
    }

    // handle special characters
    if (!identifierRegex.test(propertyKey)) {
      return acc + '["' + propertyKey + '"]';
    }

    // handle normal values
    const separator = acc.length === 0 ? '' : '.';
    return acc + separator + propertyKey;
  }, '');
}

function escapeQuotes(str: string): string {
  return str.replace(/"/g, '\\"');
}
