import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

const LoadingAnim = () => {
  const [loaderStatus, setLoaderStatus] = useState(0);
  const scalePerStatus = {
    0: 1,
    1: 1.75,
    2: 0,
  };
  const loaderProps = useSpring({
    to: {
      transform: `scale(${scalePerStatus[loaderStatus]})`,
    },
  });

  useEffect(() => {
    setLoaderStatus(1);
    setTimeout(() => setLoaderStatus(2), 750);
  }, []);
  return (
    <animated.div
      style={{
        position: 'fixed',
        width: '300px',
        height: '300px',
        // transform: '',
        // transformOrigin: 'center center',
        backgroundColor: '#eee',
        // boxShadow: '0 1px 4px #eee',
        zIndex: 20,
        borderRadius: '500px',
        top: 'calc(50% - 150px)',
        left: 'calc(50% - 150px)',
        ...loaderProps,
      }}
    >
      AYAYA
    </animated.div>
  );
};

export default LoadingAnim;
