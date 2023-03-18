export type NonEmptyArray<T> = [T, ...T[]];

export function isNonEmptyArray<T>(value: T[]): value is NonEmptyArray<T> {
  return value.length !== 0;
}
