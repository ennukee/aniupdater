import timeout from '../timeout';

jest.useFakeTimers();

it('sets timers with proper numbers', () => {
  timeout(100);
  expect(setTimeout).toHaveBeenNthCalledWith(1, expect.any(Function), 100);
});
