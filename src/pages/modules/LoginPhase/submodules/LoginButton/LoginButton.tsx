import React from 'react';
import './LoginButton.css';
import PropTypes from 'prop-types';

const LoginButton = ({ style = {}, redirect, content }) => (
  <div id="login-button" className="text-border" style={style}>
    <a href={redirect}>
      {content}
    </a>
  </div>
);

LoginButton.propTypes = {
  style: PropTypes.object,
  redirect: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default LoginButton;
