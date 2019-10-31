import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

import './Avatar.css';

const Avatar = ({ image }) => {
  const handleClick = () => {
    window.localStorage.removeItem('token');
    window.location.reload();
  };
  const handleKeyClick = (e) => {
    if (e.key === 'Enter') handleClick();
  };
  return (
    <>
      <ReactTooltip />
      <div
        id="profile-image"
        onClick={handleClick}
        onKeyDown={handleKeyClick}
        tabIndex={0}
        aria-label="Logout"
        role="button"
        data-tip="Click here to logout"
        style={image ? { backgroundImage: `url(${image})` } : {}}
      />
    </>
  );
};

Avatar.propTypes = {
  image: PropTypes.string,
};

Avatar.defaultProps = {
  image: '',
};

export default Avatar;
