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

  test('handles numeric index', () => {
    expect(joinPath([0])).toEqual('[0]');
  });

  test('handles nested object path with numeric indices', () => {
    expect(joinPath(['a', 0, 'b', 'c', 1, 2])).toEqual('a[0].b.c[1][2]');
  });
});
