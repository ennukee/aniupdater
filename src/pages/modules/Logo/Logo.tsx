import React from 'react';
import { animated, useSpring } from 'react-spring';

import './Logo.scss';

interface LProps {
  mainState?: string;
}
const Logo = ({ mainState }: LProps): React.ReactElement => {
  const logoProps = useSpring({
    width: `${mainState === 'entering' ? 150 : 360}px`,
    height: `${mainState === 'entering' ? 50 : 90}px`,
    left: `${mainState === 'entering' ? 0 : 50}%`,
    top: `${mainState === 'entering' ? 0 : 50}px`,
    transform: `translateX(-${mainState === 'entering' ? 0 : 50}%)`,
  });
  return (
    <animated.div
      id="aniupdater-logo"
      style={{
        ...logoProps,
      }}
    />
  );
};

export default Logo;
