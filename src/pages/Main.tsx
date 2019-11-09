/* Libraries */
import React, { useState, useMemo, useReducer } from 'react';
import ReactTooltip from 'react-tooltip';

/* Modules */
import LoginPhase from './modules/LoginPhase/LoginPhase';
import MainPhase from './modules/MainPhase/MainPhase';
import Footer from './modules/Footer/Footer';
import Alert from './modules/Alert/Alert';
import Logo from './modules/Logo/Logo';
import Avatar from './modules/Avatar/Avatar';
import GlobalContext from 'Utils/GlobalContext';
import useGlobalValues from 'Utils/useGlobalValues';

/* Styles */
import './Main.scss';

const width = 500;

const Main = (): React.ReactElement => {
  const [token, setToken] = useState('');
  const [userInfo, setUserInfo] = useReducer((_, newUserInfo) => newUserInfo, {});
  const [loginState, setLoginState] = useState('');
  const [mainState, setMainState] = useState('not-entered');

  const { globalValues, setGlobalValues } = useGlobalValues();
  const providerValue = useMemo(() => ({ globalValues, setGlobalValues }), [globalValues, setGlobalValues]);

  const enterMainPhase = (tkn: string, userId: number, username: string, profileImage: string): void => {
    setToken(tkn);
    setUserInfo({ username, userId, profileImage });
    setLoginState('leaving');
    setTimeout(() => {
      setLoginState('left');
      setMainState('preenter');
    }, 750);
    setTimeout(() => setMainState('entering'), 752);
  };

  return (
    <div id="app">
      <div id="bg-video-anim-container">
        <video id="bg-video-anim" autoPlay loop={true} muted={true}>
          <source src="https://anilist.co/video/hero.webm" type="video/webm" />
        </video>
      </div>
      <React.StrictMode>
        <GlobalContext.Provider value={providerValue}>
          <ReactTooltip />
          <Alert />
          <Logo mainState={mainState} />
          <nav>
            <Avatar image={userInfo.profileImage} />
          </nav>
          <main>
            {/* Accessibility concern for screen readers -- ensure an H1 for initial reading */}
            <h1
              style={{
                position: 'absolute',
                top: '-500px',
              }}
            >
              AniUpdater
            </h1>
            <section>
              <LoginPhase
                loginState={loginState}
                width={width}
                submitCallback={(tkn: string, uid: number, user: string, img: string): void =>
                  enterMainPhase(tkn, uid, user, img)
                }
              />
            </section>
            <section>
              <MainPhase
                token={token}
                // userId={userInfo.userId}
                username={userInfo.username}
                mainState={mainState}
              />
            </section>
          </main>
        </GlobalContext.Provider>
        <Footer />
      </React.StrictMode>
    </div>
  );
};

export default Main;
