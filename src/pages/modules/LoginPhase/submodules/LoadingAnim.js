import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import './LoadingAnim.css';

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
      id="loading-anim-div"
      style={{
        position: 'fixed',
        width: '300px',
        height: '300px',
        backgroundColor: '#eee',
        zIndex: 20,
        borderRadius: '500px',
        top: 'calc(50% - 150px)',
        left: 'calc(50% - 150px)',
        ...loaderProps,
      }}
    />
  );
};

export default LoadingAnim;
