export function joinPath(arr: Array<string | number>): string {
  return arr.reduce<string>((acc, value) => {
    if (typeof value === 'number') {
      return acc + '[' + value + ']';
    }

    const separator = acc === '' ? '' : '.';
    return acc + separator + value;
  }, '');
}
