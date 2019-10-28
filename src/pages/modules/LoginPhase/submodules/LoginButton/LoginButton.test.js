import React from 'react';
import {
  render,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoginButton from './LoginButton';


describe('login button', () => {
  const window = {};
  beforeAll(() => {
    const { container } = render(
      <LoginButton
        content="Log me in woo"
        redirect="http://wh.oa/"
      />,
    );
    window.container = container;
    window.container.link = window.container.querySelector('#login-button a');
  });
  it('populates the login button text', () => {
    expect(window.container.link).toHaveTextContent('Log me in woo');
  });
  it('populates the link with a proper href', () => {
    expect(window.container.link.getAttribute('href')).toBe('http://wh.oa/');
  });
});
