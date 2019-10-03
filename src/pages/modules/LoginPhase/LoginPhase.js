import React from 'react';
import PropTypes from 'prop-types';
import TokenInput from './submodules/TokenInput';
import LoginButton from './submodules/LoginButton';

const LoginPhase = ({
  loginState, width, submitDisabled, submitCallback,
}) => (
  <div
    id="login-phase"
    className={loginState}
    style={{
      width,
    }}
  >
    <TokenInput
      callback={submitCallback}
      disabled={submitDisabled}
    />
    <LoginButton
      content="No token? Click here to sign in."
      redirect="https://anilist.co/api/v2/oauth/authorize?client_id=2599&response_type=token"
      style={{
        width,
      }}
    />
  </div>
);
LoginPhase.propTypes = {
  loginState: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  submitDisabled: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
};

export default LoginPhase;
