import React from 'react';
import {
  render,
  fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import 'jest-canvas-mock';
import Avatar from './Avatar';

describe('Avatar.js', () => {
  it('should not load anything if no image is supplied', () => {
    const { container } = render(<Avatar image="" />);
    expect(container.querySelector('#profile-image')).toBeNull();
  });

  it('loads the element if an image is provided', () => {
    const { container } = render(<Avatar image="yes" />);
    const div = container.querySelector('#profile-image');
    expect(div).not.toBeNull();
    expect(div).toHaveStyle('background-image: url(yes)');
  });

  describe('page reloads', () => {
    let refreshFn;
    beforeEach(() => {
      jest.useFakeTimers();
      window.localStorage.setItem('token', 'TEST_123');

      refreshFn = jest.fn();
      window.location.reload = refreshFn;
    });

    afterEach(() => {
      jest.runAllTimers();
      window.localStorage.clear();
    });

    it('wipes the cache and reloads the page upon clicking', () => {
      const { container } = render(<Avatar image="yes" />);
      const div = container.querySelector('#profile-image');
      expect(window.localStorage.getItem('token')).toBe('TEST_123');
      fireEvent.click(div);
      setTimeout(() => {
        expect(window.localStorage.getItem('token')).toBeNull();
        expect(refreshFn).toHaveBeenCalledTimes(1);
      }, 50);
    });

    it('wipes the cache and reloads the page upon pressing Enter while focused', () => {
      const { container } = render(<Avatar image="yes" />);
      const div = container.querySelector('#profile-image');
      expect(window.localStorage.getItem('token')).toBe('TEST_123');
      fireEvent.keyDown(div, { key: 'Enter', code: 13 });
      setTimeout(() => {
        expect(window.localStorage.getItem('token')).toBeNull();
        expect(refreshFn).toHaveBeenCalledTimes(1);
      }, 50);
    });
  });
});
