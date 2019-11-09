import React from 'react';
import { animated, useSpring } from 'react-spring';

import './Logo.scss';
import image from './logo.webp'

interface LProps {
  mainState?: string;
}
const Logo = ({ mainState }: LProps): React.ReactElement => {
  const logoProps = useSpring({
    width: `${mainState === 'entering' ? 150 : 360}px`,
    height: `${mainState === 'entering' ? 40 : 70}px`,
    left: `${mainState === 'entering' ? 0 : 50}%`,
    top: `${mainState === 'entering' ? 0 : 50}px`,
    transform: `translateX(-${mainState === 'entering' ? 0 : 50}%)`,
  });
  return (
    <animated.div
      id="aniupdater-logo"
      style={{
        ...logoProps,
        backgroundImage: `url(${image})`,
      }}
    />
  );
};

export default Logo;
