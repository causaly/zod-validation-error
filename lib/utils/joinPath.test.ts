import { joinPath } from './joinPath.ts';

describe('joinPath()', () => {
  describe('single-property', () => {
    test('handles string', () => {
      expect(joinPath(['a'])).toEqual('a');
    });

    test('handles empty string', () => {
      expect(joinPath([''])).toEqual('""');
    });

    test('handles ideograms', () => {
      expect(joinPath(['你好'])).toEqual('你好');
    });

    test('handles symbol', () => {
      expect(joinPath([Symbol('a')])).toEqual('a');
    });

    test('handles empty symbol', () => {
      expect(joinPath([Symbol()])).toEqual('""');
      expect(joinPath([Symbol('')])).toEqual('""');
    });

    test('handles numeric index', () => {
      expect(joinPath([0])).toEqual('0');
    });
  });

  describe('multi-property', () => {
    test('handles strings', () => {
      expect(joinPath(['a', 'b', 'c'])).toEqual('a.b.c');
    });

    test('handles strings with ideograms', () => {
      expect(joinPath(['a', 'b', '你好'])).toEqual('a.b.你好');
    });

    test('handles strings with numeric indices', () => {
      expect(joinPath(['a', 0, 'b', 'c', 1, 2])).toEqual('a[0].b.c[1][2]');
    });

    test('handles numeric index at the beginning of the path', () => {
      expect(joinPath([0, 'a', 'b', 'c', 1, 2])).toEqual('[0].a.b.c[1][2]');
    });

    test('handles strings with special characters', () => {
      expect(joinPath(['exports', './*'])).toEqual('exports["./*"]');
    });

    test('handles strings with empty quoted string', () => {
      expect(joinPath(['a', 'b', '"'])).toEqual('a.b["\\""]');
    });

    test('handles strings with quoted value', () => {
      expect(joinPath(['a', 'b', '"foo"'])).toEqual('a.b["\\"foo\\""]');
    });

    test('handles strings with empty symbol', () => {
      expect(joinPath(['a', Symbol(), 'c'])).toEqual('a[""].c');
    });
  });
});
