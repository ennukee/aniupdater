import React from 'react';
import PropTypes from 'prop-types';

const SearchItem = (props) => {
  const {
    color, coverImage, title, showTitle,
  } = props;
  return (
    <div id="results-item">
      {showTitle ? (
        <div
          id="result-item-title"
          style={{
            color,
          }}
        >
          {title}
        </div>
      ) : (
        <div />
      )}
      <div
        className="img"
        style={{
          // backgroundImage: `url('${coverImage}')`
          border: `1px solid ${color}`,
          backgroundColor: `#${`${Math.floor(
            Math.random() * 9,
          )}`.repeat(6)}`,
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
