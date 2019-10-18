import React from 'react';
import {
  render,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import HelpMessage from '../HelpMessage';

const setup = ({ substate = 'state1', prevSubstate = 'state0' } = {}) => {
  const { container } = render(
    <HelpMessage
      substate={substate}
      prevSubstate={prevSubstate}
      helpMap={{
        state0: 'STATE_0',
        state1: 'STATE_1',
        state2: 'hi open sourcers',
      }}
    />,
  );
  const messageDiv = container.querySelector('#help-message');
  return { container, messageDiv };
};

describe('help message DOM tests', () => {
  it('renders the help message', () => {
    const { messageDiv } = setup();
    expect(messageDiv).toHaveTextContent('STATE_1');
  });
  it('renders previous state help message when in transition', () => {
    const { messageDiv } = setup({ substate: 'TRANSITION' });
    expect(messageDiv).toHaveTextContent('STATE_0');
  });
  it('has correct styling when doing transition', () => {
    const { messageDiv } = setup({ substate: 'TRANSITION' });
    expect(messageDiv).toHaveStyle('opacity: 0');
  });
});
