import React from 'react';
import {
  render,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Alert from '../Alert';
import GlobalContext from '../GlobalContext';

describe('alert dialog tests', () => {
  const setGlobalCallbackFn = jest.fn();
  it('renders the text content', () => {
    const { container } = render(
      <GlobalContext.Provider
        value={{
          globalValues: {
            alertData: {
              active: true,
              content: 'Hello world',
            },
          },
          setGlobalValues: setGlobalCallbackFn,
        }}
      >
        <Alert />
      </GlobalContext.Provider>,
    );
    expect(container.querySelector('#alert-content')).toHaveTextContent('Hello world');
  });
});
