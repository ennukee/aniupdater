import React, { useState, useEffect, useContext } from 'react';
import { useSpring, animated } from 'react-spring';

import './Alert.css';
import GlobalContext from '../util/GlobalContext';

const Alert = () => {
  const {
    globalValues: {
      alertData: {
        active,
        content,
        containerStyle,
        style,
        duration = 1250,
      },
    },
    setGlobalValues,
  } = useContext(GlobalContext);

  const [cachedAlert, setCachedAlert] = useState(content);
  const alertProps = useSpring({
    transform: `translateY(${active ? 0 : -50}px)`,
    opacity: active && content ? 1 : 0,
    ...containerStyle,
  });

  useEffect(() => {
    if (active && content) {
      const hide = setTimeout(() => setGlobalValues({
        type: 'RESET_ALERT',
      }), duration);
      return () => clearTimeout(hide);
    }
    return () => {};
  }, [active, content, duration, setGlobalValues]);

  useEffect(() => {
    if (content) setCachedAlert(content);
  }, [content]);

  return (
    <animated.div
      id="alert-container"
      style={{
        ...alertProps,
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

export const presets = {
  red: {
    borderColor: '#f99',
    backgroundColor: '#f996',
  },
  orange: {
    borderColor: '#f96',
    backgroundColor: '#f966',
  },
  green: {
    borderColor: '#9f9',
    backgroundColor: '#9b96',
  },
  white: {
    borderColor: '#eee',
    backgroundColor: '#eee6',
  },
  black: {
    borderColor: '#242229',
    backgroundColor: '#24222966',
  },
};
export default Alert;
