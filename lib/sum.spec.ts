import { sum } from './sum';

test('adds two numbers', async () => {
  expect(sum(1, 1)).toEqual(2);
});
