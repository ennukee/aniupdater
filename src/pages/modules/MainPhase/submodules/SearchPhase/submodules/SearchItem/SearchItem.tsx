import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

import './SearchItem.scss';

interface SIProps {
  color?: string | null;
  coverImage?: string | null;
  title?: string;
  index?: number;
  progress?: number | null;
  maxProgress?: number;
}
const SearchItem = ({
  // eslint-disable-next-line no-unused-vars
  color = '',
  coverImage = '',
  title = '',
  index = 0,
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
        top: `0`,
        left: `${index * 25}%`,
        width: `25%`,
        height: `100%`,
      }}
    >
      <animated.div
        className="img"
        style={{
          backgroundImage: `url('${coverImage}')`,
          border: '1px solid #222',
          height: '100%',
          // backgroundColor: `#${`${Math.floor(Math.random() * 9)}`.repeat(6)}`,
        }}
      >

            <animated.div id="result-item-title-grid-view" className="result-item-title">
              {title}
              {progress && <animated.div id="result-item-media-progress">{`${progress} / ${maxProgress}`}</animated.div>}
            </animated.div>

      </animated.div>
    </animated.div>
  );
};

export default SearchItem;
