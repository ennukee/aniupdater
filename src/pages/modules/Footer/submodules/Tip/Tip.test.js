import React from 'react';
import {
  render,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Tip from './Tip.tsx';

describe('Tip.js tests', () => {
  it('shows the differing tip messages over time', () => {
    jest.useFakeTimers();
    const { container } = render(<Tip />);
    const tip = container.querySelector('div');

    const oldTipContent = container.textContent;
    act(() => jest.advanceTimersByTime(12000));
    expect(tip.textContent).not.toBe(oldTipContent);
  });
});
