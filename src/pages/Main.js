/* Libraries */
import React, { useState } from 'react';

/* Modules */
import LoginPhase from './modules/LoginPhase/LoginPhase';
import MainPhase from './modules/MainPhase/MainPhase';

/* Utils */
import generateQueryJson from './modules/util/generateQueryJson';
import * as consts from './modules/util/const';

/* Styles */
import './css/Main.css';

const width = 500;

const Main = () => {
  const [token, setToken] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [loginState, setLoginState] = useState('');
  const [mainState, setMainState] = useState('not-entered');

  const tokenFailure = (e) => {
    console.log(e);
  };

  const tokenSuccess = (resp) => {
    if (!resp.ok) {
      tokenFailure(resp);
      return;
    }

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

  const authorizeToken = (tkn) => {
    setSubmitDisabled(true);
    const options = generateQueryJson(consts.VERIFICATION_QUERY, tkn);

    setToken(tkn);
    fetch(consts.ANILIST_BASE_URL, options).then(
      tokenSuccess,
      tokenFailure,
    );
  };

  return (
    <div id="app">
      <LoginPhase
        loginState={loginState}
        width={width}
        submitCallback={(tkn) => authorizeToken(tkn)}
        submitDisabled={submitDisabled}
      />
      <MainPhase
        token={token}
        mainState={mainState}
      />
    </div>
  );
}

export default Main;
