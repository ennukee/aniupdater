/* Libraries */
import React, { useState } from 'react';

/* Modules */
import LoginPhase from './modules/LoginPhase/LoginPhase';
import MainPhase from './modules/MainPhase/MainPhase';
import Footer from './modules/Footer';

/* Styles */
import './css/Main.css';

/*
  TODO

  ! Handle expired / invalid tokens on search / POST requests
  ! Cache previous searches in localStorage to prevent requests
  ! ! Similarly, track which mediaId was chosen per query and use it for future identical queries
  ? Implement a way to reset localStorage cache for non-technical users
  ! Implement a Context / Redux(?) to allow for a global error Alert to exist ( don't have a bunch of individual ones )
  ! test literally everything

*/

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
      <div id="bg-video-anim-container">
        <video id="bg-video-anim" autoPlay loop="loop" muted="muted">
          <source src="http://anilist.co/video/hero.webm" type="video/webm" />
        </video>
      </div>
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
      <Footer />
    </div>
  );
};

export default Main;
