import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

import './Avatar.css';

const Avatar = ({ image }) => (
  <>
    <ReactTooltip />
    <div id="profile-image" data-tip="Click here to logout" style={{ backgroundImage: `url(${image})` }} />
  </>
);

Avatar.propTypes = {
  image: PropTypes.string,
};

Avatar.defaultProps = {
  image: '',
};

export default Avatar;
