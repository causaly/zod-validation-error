import { PREFIX } from '../config.ts';

export function prefixMessage(
  message: string,
  prefix: string | null,
  prefixSeparator: string
): string {
  if (prefix !== null) {
    if (message.length > 0) {
      return [prefix, message].join(prefixSeparator);
    }

    return prefix;
  }

  if (message.length > 0) {
    return message;
  }

  // if both reason and prefix are empty, return default prefix
  // to avoid having an empty error message
  return PREFIX;
}
