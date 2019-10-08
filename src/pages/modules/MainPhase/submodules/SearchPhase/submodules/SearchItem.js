import React from 'react';
import PropTypes from 'prop-types';
import { useSpring, animated } from 'react-spring';
import * as easings from 'd3-ease';

const SearchItem = (props) => {
  const {
    color, coverImage, title, showTitle,
  } = props;
  const imageProps = useSpring({
    to: {
      width: showTitle ? '460px' : '230px',
      height: showTitle ? '99px' : '330px',
    },
    config: {
      duration: 650,
      easing: easings.easeCubicInOut,
    },
  });
  const titleProps = useSpring({
    opacity: showTitle ? 1 : 0,
    transform: `translateY(${showTitle ? 0 : -20}px)`,
    height: `${showTitle ? 24 : 0}px`,
  });
  return (
    <div id="results-item">
      <animated.div
        id="result-item-title"
        style={{
          color,
          ...titleProps,
        }}
      >
        {title}
      </animated.div>
      <animated.div
        className="img"
        style={{
          
          // backgroundImage: `url('${coverImage}')`
          border: `1px solid ${color}`,
          backgroundColor: `#${`${Math.floor(
            Math.random() * 9,
          )}`.repeat(6)}`,
          ...imageProps,
        }}
      />
    </div>
  );
};

export default SearchItem;

SearchItem.propTypes = {
  color: PropTypes.string.isRequired,
  coverImage: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  showTitle: PropTypes.bool,
};

SearchItem.defaultProps = {
  showTitle: false,
};
