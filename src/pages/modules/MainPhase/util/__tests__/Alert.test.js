import React from 'react';
import {
  render,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Alert from '../Alert';

describe('alert dialog tests', () => {
  it('renders the text content', () => {
    const { container } = render(
      <Alert
        active
        content="Hello world"
      />,
    );
    expect(container.querySelector('#alert-content')).toHaveTextContent('Hello world');
  });
});
