// Unsurprisingly, nothing is here.
import React from 'react';
import {
  render, fireEvent, act,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoadingAnim from '../LoadingAnim';

describe('loading anim tests', () => {
  it('preloads small image before main image', () => {
    jest.useFakeTimers();

    const { container } = render(<LoadingAnim />);
    const elem = container.querySelector('#loading-anim-div');

    expect(elem).toHaveAttribute('src', expect.stringContaining('verysmall'));
    act(() => {
      fireEvent.load(elem);
    });
    setTimeout(() => {
      expect(elem).toHaveAttribute('src', expect.stringContaining('full'));
    }, 100);

    // because we have time based state updates for animation purposes that we can't track
    act(() => jest.runAllTimers());
  });
});
