import React, { useState, useEffect, useRef } from 'react';
// import ProgressiveImage from 'react-progressive-image';
import { useSpring, animated } from 'react-spring';
import './LoadingAnim.css';

import img from '../../../../../loading_verysmall.jpg';
import fullImg from '../../../../../loading_full.jpg';

const LoadingAnim = () => {
  const [loaderStatus, setLoaderStatus] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef();
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

  const handleImageLoad = () => {
    if (!imageLoaded) {
      setImageLoaded(true);
      imgRef.current.src = fullImg;
    }
  };

  useEffect(() => {
    setLoaderStatus(1);
    setTimeout(() => setLoaderStatus(2), 750);
  }, []);
  return (
    <animated.img
      id="loading-anim-div"
      alt="Loading animation image"
      ref={imgRef}
      src={img}
      onLoad={handleImageLoad}
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
