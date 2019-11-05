import React, { useState, useEffect, useContext } from 'react';
import { useSpring, animated } from 'react-spring';

import './Alert.css';
import GlobalContext, { GlobalContextOptions } from '../util/GlobalContext';

const Alert = () => {
  const {
    globalValues: {
      alertData: { active = false, content = '', containerStyle = {}, style = {}, duration = 1250 } = {},
    } = {},
    setGlobalValues,
  }: GlobalContextOptions = useContext(GlobalContext);

  const [cachedAlert, setCachedAlert] = useState(content);
  const alertProps = useSpring({
    transform: `translateY(${active ? 0 : -50}px)`,
    opacity: active && content ? 1 : 0,
    ...containerStyle,
  });

  useEffect(() => {
    if (active && content) {
      const hide = setTimeout(
        () =>
          setGlobalValues &&
          setGlobalValues({
            type: 'RESET_ALERT',
          }),
        duration,
      );
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
export default Alert;
