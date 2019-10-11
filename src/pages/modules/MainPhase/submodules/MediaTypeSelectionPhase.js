import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import Alert from '../util/Alert';

const MediaTypeSelectionPhase = ({ transitionCallback, username }) => {
  const [alertActive, setAlertActive] = useState(false);
  const handleKeyPress = useCallback((e) => {
    const { [e.key.toLowerCase()]: mediaType } = {
      a: 'ANIME', m: 'MANGA',
    };
    if (mediaType) {
      transitionCallback(mediaType);
    }
  }, [transitionCallback]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    setTimeout(() => setAlertActive(true), 750);
    setTimeout(() => setAlertActive(false), 2250);
  }, []);

  return (
    <div>
      <Alert
        active={alertActive}
        content={`Welcome ${username}`}
        containerStyle={{
          top: '200px',
        }}
        style={{
          fontSize: '16px',
          backgroundColor: '#2229',
          border: '1px solid #eee',
          color: '#eee',
        }}
      />
      <span className="aom-a">
        <span className="bold dark">A</span>
        nq
      </span>
      &nbsp;or&nbsp;
      <span className="aom-m">
        <span className="bold dark">M</span>
        ar
      </span>
    </div>
  );
};

MediaTypeSelectionPhase.propTypes = {
  transitionCallback: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
};

export default MediaTypeSelectionPhase;
