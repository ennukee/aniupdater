import React from 'react';
import ReactTooltip from 'react-tooltip';

import './Avatar.scss';

const Avatar = ({ image = '' }): React.ReactElement => {
  const handleClick = (): void => {
    window.localStorage.removeItem('token');
    window.location.reload();
  };
  const handleKeyClick = (e: React.KeyboardEvent<HTMLDivElement>): void => {
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

export default Avatar;
