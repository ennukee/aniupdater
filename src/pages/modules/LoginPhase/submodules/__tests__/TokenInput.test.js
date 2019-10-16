import React from 'react';
import {
  render,
  fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import 'jest-canvas-mock';
import fetch from 'jest-fetch-mock';
import TokenInput from '../TokenInput';

describe('preloading token in localStorage', () => {
  it('loads token and attempts to verify', () => {
    // Mock successful response data so we can spy on the token passing to the callback
    fetch.mockResponseOnce(JSON.stringify({
      data: { Viewer: { id: 3, name: 'Nobo' } },
    }));

    // Add a token to localStorage
    window.localStorage.setItem('token', 'WOW_A_TOKEN');

    // Now we resume the normal flow
    const callbackFn = jest.fn();
    const { container } = render(
      <TokenInput callback={callbackFn} />,
    );
    fireEvent.click(container.querySelector('#token-submit'));
    setTimeout(() => expect(callbackFn).toHaveBeenCalledWith('WOW_A_TOKEN', 3, 'Nobo'), 50);
  });
});

describe('token input', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  it('displays an error on invalid token', async () => {
    fetch.mockResponseOnce(JSON.stringify({
      errors: [{ message: 'Invalid token', status: 400, locations: [Array] }],
      data: { Viewer: null },
    }));
    const { container, findByText } = render(
      <TokenInput callback={() => {}} />,
    );
    const errorMsg = 'This token is either invalid or has expired. '
      + 'Please use the link below to get a new token and try again.';
    fireEvent.click(container.querySelector('#token-submit'));
    const errorPopup = await findByText(errorMsg);
    expect(errorPopup).toBeDefined();
  });

  it('runs the callback and saves token when token is valid', () => {
    fetch.mockResponseOnce(JSON.stringify({
      data: { Viewer: { id: 5, name: 'Nobody' } },
    }));
    const callbackFn = jest.fn();
    const { container } = render(
      <TokenInput callback={callbackFn} />,
    );
    fireEvent.click(container.querySelector('#token-submit'));
    setTimeout(() => {
      expect(callbackFn).toHaveBeenCalledWith('', 5, 'Nobody');
      expect(window.localStorage.getItem('token')).toBe('');
    }, 50);
  });
});
