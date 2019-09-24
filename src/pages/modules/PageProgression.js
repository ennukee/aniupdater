import React from 'react';
import PropTypes from 'prop-types';
import './css/PageProgression.css';

function PageProgression(props) {
  const { maxPages } = props;
  return (
    <div id="container">
      {[...Array(maxPages)].map((i) => <div>{i}</div>)}
    </div>
  );
}

PageProgression.propTypes = {
  maxPages: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
};

export default PageProgression;
