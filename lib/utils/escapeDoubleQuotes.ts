export function escapeDoubleQuotes(str: string): string {
  return str.replace(/"/g, '\\"');
}
