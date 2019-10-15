import React from 'react';
import PropTypes from 'prop-types';
import './PageProgression.css';

const PageProgression = (props) => {
  const { maxPages, page } = props;
  return maxPages > 1 && (
    <div id="page-prog-container">
      <div id="line-container">
        <div id="line">
          <div
            id="line-fill"
            style={{
              width: `${Math.floor(((page - 1) / (Math.max(maxPages - 1, 1))) * 100)}%`,
            }}
          />
        </div>
      </div>
      <div id="circles">
        {[...Array(maxPages)].map((v, i) => (
          <div
            key={v}
            className={`
              page-prog-circle 
              ${i + 1 < page ? 'pastPage' : ''}
              ${i + 1 === page ? 'activePage' : ''}
            `}
          />
        ))}
      </div>
    </div>
  );
};

PageProgression.propTypes = {
  maxPages: PropTypes.number,
  page: PropTypes.number,
};

PageProgression.defaultProps = {
  maxPages: 0,
  page: 0,
};

export default PageProgression;
