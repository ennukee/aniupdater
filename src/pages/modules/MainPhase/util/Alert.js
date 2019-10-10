import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSpring, animated } from 'react-spring';

import './Alert.css';

const Alert = ({ active, content, style, containerStyle }) => {
  const [cachedAlert, setCachedAlert] = useState(content);
  const alertProps = useSpring({
    transform: `translateY(${active ? -150 : -250}%)`,
    opacity: active ? 1 : 0,
  });

  useEffect(() => {
    if (content) setCachedAlert(content);
  }, [content]);
  return (
    <animated.div
      id="alert-container"
      style={{
        ...alertProps,
        ...containerStyle,
      }}
    >
      <div
        id="alert-content"
        style={{
          border: '1px solid #eee',
          ...style,
        }}
      >
        {content || cachedAlert}
      </div>
    </animated.div>
  );
};

Alert.propTypes = {
  active: PropTypes.bool.isRequired,
  content: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
};

export default Alert;
