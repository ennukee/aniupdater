import React, { useEffect, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';

import GlobalContext, { GlobalContextOptions } from '../../../util/GlobalContext';
import { KeyPress } from 'interfaces/interfaces';

interface MTSPProps {
  transitionCallback: Function;
  username?: string;
}
const MediaTypeSelectionPhase = ({ transitionCallback, username }: MTSPProps): React.ReactElement => {
  const { setGlobalValues }: GlobalContextOptions = useContext(GlobalContext);

  const handleKeyPress = useCallback(
    (e: KeyPress) => {
      const keyPressed: string = e.key.toLowerCase();
      const validMappings: Record<string, string> = { a: 'ANIME', m: 'MANGA' };
      const { [keyPressed]: mediaType } = validMappings;
      if (mediaType) {
        transitionCallback(mediaType);
      }
    },
    [transitionCallback],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return (): void => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (username) {
      setTimeout(
        () =>
          setGlobalValues &&
          setGlobalValues({
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
          }),
        750,
      );
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
