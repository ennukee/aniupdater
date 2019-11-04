import React from 'react';
import PropTypes from 'prop-types';
import { animated, useSpring } from 'react-spring';

import './Logo.css';

const Logo = ({ mainState }) => {
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

Logo.propTypes = {
  mainState: PropTypes.string.isRequired,
};

export default Logo;
