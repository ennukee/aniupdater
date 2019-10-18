import React from 'react';
import PropTypes from 'prop-types';
import { useSpring, animated } from 'react-spring';

import './HelpMessage.css';

const HelpMessage = ({ substate, prevSubstate, helpMap }) => {
  const helpMessageProps = useSpring({
    opacity: substate === 'TRANSITION' ? 0 : 1,
    transform: `translateX(${substate === 'TRANSITION' ? -20 : 0}px)`,
  });

  return (helpMap[substate] || helpMap[prevSubstate]) && (
    <animated.div style={helpMessageProps} id="help-message" className={substate}>
      {helpMap[substate] || helpMap[prevSubstate]}
    </animated.div>
  );
};

HelpMessage.propTypes = {
  substate: PropTypes.string.isRequired,
  prevSubstate: PropTypes.string.isRequired,
  helpMap: PropTypes.object.isRequired,
};

export default HelpMessage;
