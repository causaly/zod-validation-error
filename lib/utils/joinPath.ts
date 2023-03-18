/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#identifiers
 */
const identifierRegex = /[$_\p{ID_Start}][$\u200c\u200d\p{ID_Continue}]*/u;

export function joinPath(arr: Array<string | number>): string {
  return arr.reduce<string>((acc, value) => {
    // handle numeric indices
    if (typeof value === 'number') {
      return acc + '[' + value + ']';
    }

    // handle quoted values
    if (value.includes('"')) {
      return acc + '["' + value.replace(/"/g, '\\"') + '"]';
    }

    // handle special characters
    if (!identifierRegex.test(value)) {
      return acc + '["' + value + '"]';
    }

    // handle normal values
    const separator = acc.length === 0 ? '' : '.';
    return acc + separator + value;
  }, '');
}
