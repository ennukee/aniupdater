import React, { useState, useEffect, useRef } from 'react';
// import ProgressiveImage from 'react-progressive-image';
import { useSpring, animated } from 'react-spring';
import './LoadingAnim.css';

import img from '../../../../../loading_verysmall.webp';
import fullImg from '../../../../../loading_full.webp';

const LoadingAnim = (): React.ReactElement => {
  const [loaderStatus, setLoaderStatus] = useState<number>(0);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const scalePerStatus: Array<number> = [1, 1.75, 0];
  const loaderProps = useSpring({
    to: {
      transform: `scale(${scalePerStatus[loaderStatus]})`,
    },
  });

  const handleImageLoad = (): void => {
    if (!imageLoaded) {
      setImageLoaded(true);
      if (imgRef.current) {
        imgRef.current.src = fullImg;
      } else {
        setTimeout(() => {
          handleImageLoad();
        }, 100);
      }
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
