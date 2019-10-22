import React, { useState, useEffect, useContext } from 'react';
import { useSpring, animated } from 'react-spring';

import './Alert.css';
import GlobalContext from './GlobalContext';

const Alert = () => {
  const {
    globalValues: {
      alertData: {
        active,
        content,
        containerStyle,
        style,
      },
    },
    setGlobalValues,
  } = useContext(GlobalContext);

  const [cachedAlert, setCachedAlert] = useState(content);
  const alertProps = useSpring({
    transform: `translateY(${active ? -150 : -250}%)`,
    opacity: active && content ? 1 : 0,
  });

  useEffect(() => {
    if (active && content) {
      const hide = setTimeout(() => setGlobalValues({
        type: 'RESET_ALERT',
      }), 1250);
      return () => clearTimeout(hide);
    }
    return () => {};
  }, [active, content, setGlobalValues]);

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

export default Alert;
