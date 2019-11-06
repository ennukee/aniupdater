import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

import './SearchItem.scss';

interface SIProps {
  color?: string | null;
  coverImage?: string | null;
  title?: string;
  index?: number;
  isFlatView?: boolean;
  progress?: number | null;
  maxProgress?: number;
}
const SearchItem = ({
  // eslint-disable-next-line no-unused-vars
  color = '',
  coverImage = '',
  title = '',
  index = 0,
  isFlatView = false,
  progress,
  maxProgress = 0,
}: SIProps): React.ReactElement => {
  const [loaded, setLoaded] = useState(false);
  const itemProps = useSpring({
    transform: `translateY(${loaded ? 0 : -20}px)`,
    opacity: loaded ? 1 : 0,
  });
  useEffect(() => {
    const load = setTimeout(() => setLoaded(true), index * 25);
    return (): void => clearTimeout(load);
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
          // TODO
          // backgroundImage: `url('${coverImage}')`,
          border: '1px solid #222',
          height: '100%',
          backgroundColor: `#${`${Math.floor(Math.random() * 9)}`.repeat(6)}`,
        }}
      >
        {isFlatView ? (
          <animated.div id="result-item-title-flat-view" className="result-item-title">
            {title}
            {progress && <animated.div id="result-item-media-progress">{`${progress} / ${maxProgress}`}</animated.div>}
          </animated.div>
        ) : (
          <animated.div id="result-item-title-grid-view" className="result-item-title">
            {title}
            {progress && <animated.div id="result-item-media-progress">{`${progress} / ${maxProgress}`}</animated.div>}
          </animated.div>
        )}
      </animated.div>
    </animated.div>
  );
};

export default SearchItem;
