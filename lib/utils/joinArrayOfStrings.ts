type JoinArrayOfStringsOptions = {
  separator: string;
  lastSeparator: string;
};

export function joinArrayOfStrings(
  arrayOfStrings: Array<string>,
  options: JoinArrayOfStringsOptions = {
    separator: ', ',
    lastSeparator: ' and ',
  }
): string {
  return arrayOfStrings.reduce((acc, str, index) => {
    if (index === 0) {
      return str;
    }

    if (index === arrayOfStrings.length - 1) {
      return acc + options.lastSeparator + str;
    }

    return acc + options.separator + str;
  }, '');
}
