import React, { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import TokenInput from './submodules/TokenInput/TokenInput';
import LoginButton from './submodules/LoginButton/LoginButton';
import LoadingAnim from './submodules/LoadingAnim/LoadingAnim';

import './LoginPhase.scss';

interface LPProps {
  loginState?: string;
  width?: number;
  submitCallback?: Function;
}
const LoginPhase = ({ loginState, width, submitCallback }: LPProps): React.ReactElement => {
  // all this to make the loading animation div thing work lol //
  const [preloadBuffer, setPreloadBuffer] = useState(false);
  const loginPhaseDivProps = useSpring({
    opacity: `${preloadBuffer && loginState === '' ? 1 : 0}`,
  });
  useEffect(() => {
    const preloadedToken = window.localStorage.getItem('token');
    if (preloadedToken) {
      setTimeout(() => setPreloadBuffer(true), 1000);
    } else {
      setPreloadBuffer(true);
    }
  }, []);
  // ---------- //
  return (
    <>
      <LoadingAnim />
      <animated.div
        id="login-phase"
        className={loginState}
        style={{
          width,
          ...loginPhaseDivProps,
        }}
      >
        <TokenInput callback={submitCallback} />
        <LoginButton
          content="No token? Click here to sign in."
          redirect="https://anilist.co/api/v2/oauth/authorize?client_id=2599&response_type=token"
          style={{
            width,
          }}
        />
      </animated.div>
    </>
  );
};

export default LoginPhase;
