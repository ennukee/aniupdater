import React, { useEffect, useCallback, useContext } from 'react';

import GlobalContext, { GlobalContextOptions } from 'Utils/GlobalContext';

import './MediaTypeSelectionPhase.scss';

interface MTSPProps {
  transitionCallback: Function;
  username?: string;
}
const MediaTypeSelectionPhase = ({ transitionCallback, username }: MTSPProps): React.ReactElement => {
  const { setGlobalValues }: GlobalContextOptions = useContext(GlobalContext);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent): void => {
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
      <span className="red">
        <span className="bold dark">A</span>
        nq
      </span>
      &nbsp;or&nbsp;
      <span className="blue">
        <span className="bold dark">M</span>
        ar
      </span>
    </div>
  );
};

export default MediaTypeSelectionPhase;
