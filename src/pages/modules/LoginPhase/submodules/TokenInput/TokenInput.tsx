import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { useSpring, animated } from 'react-spring';
import { IoIosCheckmark } from 'react-icons/io';

import PropTypes from 'prop-types';

import generateQueryJson from 'Utils/generateQueryJson';
import * as consts from 'Utils/const';
import { InitialQuery } from 'interfaces/interfaces';

import './TokenInput.scss';

interface TIProps {
  callback?: Function;
}
const TokenInput = ({ callback }: TIProps): React.ReactElement => {
  const [inputVal, setInputVal] = useState('');
  const [processing, setProcessing] = useState(false);
  // TODO: probably combine these two into one single reducer since they go hand-in-hand
  const [alertMessage, setAlertMessage] = useState('');
  const [alertColor, setAlertColor] = useReducer(
    (oldV, newV) => ({
      ...oldV,
      ...newV,
    }),
    {},
  );

  const tokenFailure = (e: InitialQuery): void => {
    console.info(e);
    setAlertMessage(
      'This token is either invalid or has expired. Please use the link below to get a new token and try again.',
    );
    setAlertColor({ bg: '#eee', border: '#222' });
    setProcessing(false);
  };

  const tokenSuccess = useCallback(
    (resp: InitialQuery, tkn: string) => {
      // TODO: pls refactor this to not be literal garbage when CRA is updated to work with TS3.7's optional chaining
      if (!resp || !resp.data || !resp.data.Viewer || !resp.data.Viewer.id || !resp.data.Viewer.name) {
        tokenFailure(resp);
        return;
      }

      window.localStorage.setItem('token', tkn);
      // console.log(resp.data.Viewer);
      callback
        ? callback(
            tkn,
            resp.data.Viewer.id,
            resp.data.Viewer.name,
            resp.data.Viewer.avatar && resp.data.Viewer.avatar.medium,
          )
        : setTimeout(() => {
            tokenSuccess(resp, tkn);
          }, 100);
    },
    [callback],
  );

  const authorizeToken = useCallback(
    (tkn: string): void => {
      setProcessing(true);
      const options = generateQueryJson(consts.VERIFICATION_QUERY, tkn);

      fetch(consts.ANILIST_BASE_URL, options)
        .then(resp => resp.json())
        .then(resp => tokenSuccess(resp, tkn));
    },
    [tokenSuccess],
  );

  const handleEnterKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement> | React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Enter') authorizeToken(inputVal);
    },
    [authorizeToken, inputVal],
  );

  useEffect(() => {
    const preloadedToken = window.localStorage.getItem('token');
    if (preloadedToken) {
      setInputVal(preloadedToken);
      authorizeToken(preloadedToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const alertMessageProps = useSpring({
    opacity: alertMessage ? 1 : 0,
    transform: `translateY(${alertMessage ? 0 : -20}px)`,
  });

  return (
    <div id="input-container">
      <animated.div style={{ gridArea: '1 / 1 / 2 / 3', ...alertMessageProps }}>
        <div
          id="alert-box"
          style={{
            border: `1px solid ${alertColor.border}`,
            backgroundColor: alertColor.bg,
            color: alertColor.border,
            boxShadow: `0 1px 4px ${alertColor.border}`,
          }}
        >
          <IoIosCheckmark id="alert-icon" size={40} style={{ float: 'left' }} />
          {/* <UseAnimations id="alert-icon" animationKey="alertCircle" size={40} style={{ float: 'left' }} /> */}
          {alertMessage}
        </div>
      </animated.div>
      <div id="token-input-row">
        <input
          id="token-input"
          aria-label="AniList access token input field"
          type="text"
          placeholder="AniList Token"
          value={inputVal}
          onKeyDown={handleEnterKeyPress}
          onChange={(e): void => setInputVal(e.target.value)}
        />
        <div
          id="token-submit"
          aria-label="Submit"
          className={processing ? 'disabled' : ''}
          role="button"
          tabIndex={0}
          onKeyDown={handleEnterKeyPress}
          onClick={(): void => authorizeToken(inputVal)}
        >
          <IoIosCheckmark size="3.5em" color={processing ? '666666' : 'c94c96'} />
        </div>
      </div>
    </div>
  );
};

export default TokenInput;

TokenInput.propTypes = {
  callback: PropTypes.func.isRequired,
};
