import React from 'react';
import { useSpring, animated } from 'react-spring';
import { IoIosInformationCircleOutline } from 'react-icons/io';

import './HelpMessage.scss';

interface HMProps {
  substate?: string;
  prevSubstate?: string;
  helpMap: { [key: string]: React.ReactElement };
}
const HelpMessage = ({ substate = '', prevSubstate = '', helpMap }: HMProps): React.ReactElement => {
  const helpMessageProps = useSpring({
    opacity: substate === 'TRANSITION' ? 0 : 1,
    transform: `translateX(${substate === 'TRANSITION' ? -20 : 0}px)`,
  });

  return helpMap[substate] || helpMap[prevSubstate] ? (
    <div id="help-message-container">
      <animated.div style={helpMessageProps} id="help-message" className={substate}>
        <IoIosInformationCircleOutline
          size="1.75em"
          style={{
            paddingRight: '3px',
          }}
        />
        {helpMap[substate] || helpMap[prevSubstate]}
      </animated.div>
    </div>
  ) : (
    <></>
  );
};

export default HelpMessage;
