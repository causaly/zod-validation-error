import { joinPath } from './joinPath';

describe('joinPath()', () => {
  test('handles empty path', () => {
    expect(joinPath([])).toEqual('');
  });

  test('handles flat object path', () => {
    expect(joinPath(['a'])).toEqual('a');
  });

  test('handles nested object path', () => {
    expect(joinPath(['a', 'b', 'c'])).toEqual('a.b.c');
  });

  test('handles ideograms', () => {
    expect(joinPath(['你好'])).toEqual('你好');
  });

  test('handles nested object path with ideograms', () => {
    expect(joinPath(['a', 'b', '你好'])).toEqual('a.b.你好');
  });

  test('handles numeric index', () => {
    expect(joinPath([0])).toEqual('[0]');
  });

  test('handles nested object path with numeric indices', () => {
    expect(joinPath(['a', 0, 'b', 'c', 1, 2])).toEqual('a[0].b.c[1][2]');
  });

  test('handles special characters', () => {
    expect(joinPath(['exports', './*'])).toEqual('exports["./*"]');
  });

  test('handles quote corner-case', () => {
    expect(joinPath(['a', 'b', '"'])).toEqual('a.b["\\""]');
  });

  test('handles quoted values', () => {
    expect(joinPath(['a', 'b', '"foo"'])).toEqual('a.b["\\"foo\\""]');
  });

  test('handles unicode characters', () => {
    expect(joinPath(['a', 'b', '💩'])).toEqual('a.b["💩"]');
  });
});
