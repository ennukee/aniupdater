import React from 'react';
import PropTypes from 'prop-types';
import { animated } from 'react-spring';

const SearchItem = ({
  color, coverImage, title, showTitle, index, isFlatView,
}) => (
  <div
    id="results-item"
    style={{
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
          id="result-item-title-grid-view"
          className="result-item-title"
        >
          {title}
        </animated.div>
      ) : (
        <animated.div
          id="result-item-title-flat-view"
          className={`result-item-title ${index > 1 ? 'grid-right-side' : 'grid-left-side'}`}
        >
          {title}
        </animated.div>
      )}
    </animated.div>
  </div>
);

export default SearchItem;

SearchItem.propTypes = {
  color: PropTypes.string.isRequired,
  coverImage: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  showTitle: PropTypes.bool,
  index: PropTypes.number.isRequired,
  isFlatView: PropTypes.bool.isRequired,
};

SearchItem.defaultProps = {
  showTitle: false,
};
