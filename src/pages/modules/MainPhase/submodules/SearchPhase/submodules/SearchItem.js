import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSpring, animated } from 'react-spring';

const SearchItem = ({
  // eslint-disable-next-line no-unused-vars
  color, coverImage, title, showTitle, index, isFlatView, progress, maxProgress,
}) => {
  const [loaded, setLoaded] = useState(false);
  const itemProps = useSpring({
    transform: `translateY(${loaded ? 0 : -20}px)`,
    opacity: loaded ? 1 : 0,
  });
  useEffect(() => {
    // setLoaded(true);
    const load = setTimeout(() => setLoaded(true), index * 25);
    return () => clearTimeout(load);
  }, [index]);
  return (
    <animated.div
      id="results-item"
      style={{
        ...itemProps,
        top: `${!isFlatView ? 0 : Math.floor(index / 2) * 50}%`,
        left: `${!isFlatView ? index * 25 : (index % 2) * 50}%`,
        width: `${!isFlatView ? 25 : 50}%`,
        height: `${!isFlatView ? 100 : 50}%`,
      }}
    >
      <animated.div
        className="img"
        style={{
          // backgroundImage: `url('${coverImage}')`,
          border: '1px solid #222',
          height: '100%',
          backgroundColor: `#${`${Math.floor(
            Math.random() * 9,
          )}`.repeat(6)}`,
          // ...imageProps,
        }}
      >
        {isFlatView ? (
          <animated.div
            id="result-item-title-flat-view"
            className="result-item-title"
          >
            {title}
            {progress
              && (
              <animated.div
                id="result-item-media-progress"
              >
                {`${progress} / ${maxProgress}`}
              </animated.div>
              )}
          </animated.div>
        ) : (
          <animated.div
            id="result-item-title-grid-view"
            className="result-item-title"
          >
            {title}
            {progress
              && (
              <animated.div
                id="result-item-media-progress"
              >
                {`${progress} / ${maxProgress}`}
              </animated.div>
              )}
          </animated.div>
        )}
        
      </animated.div>
    </animated.div>
  );
};

export default SearchItem;

SearchItem.propTypes = {
  color: PropTypes.string.isRequired,
  coverImage: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  showTitle: PropTypes.bool,
  index: PropTypes.number.isRequired,
  isFlatView: PropTypes.bool.isRequired,
  progress: PropTypes.string.isRequired,
  maxProgress: PropTypes.string.isRequired,
};

SearchItem.defaultProps = {
  showTitle: false,
};
