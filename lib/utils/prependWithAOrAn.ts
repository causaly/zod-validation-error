const vowelSoundCharSet = new Set(['a', 'e', 'i', 'o', 'u', 'h']);

export function prependWithAOrAn(value: string): string {
  const firstLetter = value.charAt(0).toLowerCase();
  const prefix = vowelSoundCharSet.has(firstLetter) ? 'an' : 'a';
  return [prefix, value].join(' ');
}
