import React, {
  useEffect, useCallback, useContext,
} from 'react';
import PropTypes from 'prop-types';

import GlobalContext from '../../util/GlobalContext';

const MediaTypeSelectionPhase = ({ transitionCallback, username }) => {
  // const [alertActive, setAlertActive] = useState(false);
  const { setGlobalValues } = useContext(GlobalContext);

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
    if (username) {
      setTimeout(() => setGlobalValues({
        type: 'ALERT',
        data: {
          active: true,
          content: `Welcome ${username}`,
          style: {
            fontSize: '16px',
            backgroundColor: '#2229',
            border: '1px solid #eee',
            color: '#eee',
          },
        },
      }), 750);
    }
  }, [setGlobalValues, username]);

  return (
    <div>
      {/* <Alert
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
      /> */}
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
