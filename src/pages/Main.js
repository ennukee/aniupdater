/* Libraries */
import React, { useState, useCallback } from 'react';

/* Modules */
import LoginPhase from './modules/LoginPhase/LoginPhase';
import MainPhase from './modules/MainPhase/MainPhase';

/* Styles */
import './css/Main.css';

const width = 500;

const Main = () => {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState(0);
  const [username, setUsername] = useState('');
  const [loginState, setLoginState] = useState('');
  const [mainState, setMainState] = useState('not-entered');

  const enterMainPhase = (tkn, uid, user) => {
    setToken(tkn);
    setUserId(uid);
    setUsername(user);
    setLoginState('leaving');
    setTimeout(
      () => {
        setLoginState('left');
        setMainState('preenter');
      },
      750,
    );
    setTimeout(
      () => setMainState('entering'),
      752,
    );
  };

  return (
    <div id="app">
      <LoginPhase
        loginState={loginState}
        width={width}
        submitCallback={(tkn, uid, user) => enterMainPhase(tkn, uid, user)}
      />
      <MainPhase
        token={token}
        userId={userId}
        username={username}
        mainState={mainState}
      />
    </div>
  );
};

export default Main;
