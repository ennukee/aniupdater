import React from 'react';
import {
  render,
  fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MediaTypeSelectionPhase from '../MediaTypeSelectionPhase';

const setup = () => {
  const callbackFn = jest.fn();
  const { container } = render(
    <MediaTypeSelectionPhase
      transitionCallback={callbackFn}
      username="Kuon"
    />,
  );
  return { callbackFn, container };
};

describe('media type selection phase tests', () => {
  it('fires the callback on A or M click, but not others', () => {
    const { container, callbackFn } = setup();
    expect(callbackFn).toHaveBeenCalledTimes(0);
    fireEvent.keyDown(container, { key: 'a', code: 65 });
    expect(callbackFn).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(container, { key: 'm', code: 77 });
    expect(callbackFn).toHaveBeenCalledTimes(2);
    fireEvent.keyDown(container, { key: 'b', code: 66 });
    expect(callbackFn).toHaveBeenCalledTimes(2);
  });
});
