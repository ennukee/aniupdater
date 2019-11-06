import React, { useState, useEffect, useCallback, useContext } from 'react';
// import PropTypes from 'prop-types';
import {
  MEDIA_STATUS_COLORS,
  MEDIA_TYPE_SINGLETON_TERM,
  SHOULD_SCORE_MEDIA_STATUS,
  POST_MEDIA_CHANGE_QUERY_GEN,
  ANILIST_BASE_URL,
  MEDIA_STATUS_ALERT_MESSAGES,
} from 'Utils/const';
import generateQueryJson from 'Utils/generateQueryJson';

import './DataForm.scss';
import GlobalContext, { GlobalContextOptions } from 'Utils/GlobalContext';
import presets from '../../../Alert/presets';

interface DFProps {
  title?: string;
  image?: string | null;
  color?: string | null;
  type?: string;
  token?: string;
  mediaId?: number;
  transitionCallback: Function;
  presetProgress?: number | null;
  presetScore?: number | null;
}

const DataForm = ({
  title = '',
  image = '',
  color = '',
  type = '',
  token = '',
  mediaId = 0,
  transitionCallback,
  presetProgress = undefined,
  presetScore = undefined,
}: DFProps): React.ReactElement => {
  const [status, setStatus] = useState('CURRENT');
  const [progress, setProgress] = useState(presetProgress);
  const [score, setScore] = useState(presetScore);

  const { setGlobalValues }: GlobalContextOptions = useContext(GlobalContext);

  /* Get current media status color or default to black */
  const currentMediaColor = useCallback(
    (override: string = status): string => MEDIA_STATUS_COLORS[override] || '#222',
    [status],
  );

  const handleBadRequest = useCallback((): void => {
    setGlobalValues &&
      setGlobalValues({
        type: 'ALERT',
        data: {
          active: true,
          content: 'Something went wrong with the request. The page will automatically refresh in 2 seconds.',
          duration: 2000,
          style: presets.red,
        },
      });
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }, [setGlobalValues]);

  const switchMediaMode = useCallback(
    (newStatus: string) => {
      setStatus(newStatus);
      setGlobalValues &&
        setGlobalValues({
          type: 'ALERT',
          data: {
            active: true,
            content: MEDIA_STATUS_ALERT_MESSAGES[newStatus],
            style: {
              border: `1px solid ${currentMediaColor(newStatus)}`,
              backgroundColor: `${currentMediaColor(newStatus)}3`,
            },
          },
        });
    },
    [currentMediaColor, setGlobalValues],
  );

  /* Key Press Event Handler */
  const handleKeyPress = useCallback(
    (e: KeyboardEvent): void => {
      const keyPressed: string = e.key;
      const { [keyPressed.toLowerCase()]: newStatus }: Record<string, string> = {
        u: 'CURRENT',
        c: 'COMPLETED',
        d: 'DROPPED',
        h: 'PAUSED',
      };
      if (newStatus) {
        switchMediaMode(newStatus);
      } else if (e.key === 'Enter') {
        const options = generateQueryJson(
          POST_MEDIA_CHANGE_QUERY_GEN({
            mediaId,
            status,
            score,
            progress,
          }),
          token,
        );
        fetch(ANILIST_BASE_URL, options)
          .then(resp => resp.json())
          .then(resp =>
            resp.ok
              ? transitionCallback() // return to search phase
              : handleBadRequest(),
          )
          .catch(handleBadRequest);
      }
    },
    [handleBadRequest, mediaId, progress, score, status, switchMediaMode, token, transitionCallback],
  );

  /* Event handling setup and initial form focus */
  useEffect(() => {
    const mediaCountElem = document.getElementById('data-form-media-count-value');
    mediaCountElem && mediaCountElem.focus();
    document.addEventListener('keydown', handleKeyPress);

    return (): void => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  /* Rendering */
  return (
    <>
      <div id="data-form-container">
        {/* <Alert
          active={alertActive}
          content={alertActive}
          style={{
            border: `1px solid ${currentMediaColor()}`,
            backgroundColor: `${currentMediaColor()}3`,
          }}
        /> */}
        <div
          id="data-form-image"
          style={{
            // TODO
            // backgroundImage: `url('${image}')`,
            backgroundColor: `#${`${Math.floor(Math.random() * 9)}`.repeat(6)}`,
            border: `1px solid ${currentMediaColor()}`,
          }}
        />
        <div
          id="data-form-content"
          style={{
            border: `1px solid ${currentMediaColor()}`,
          }}
        >
          <div id="data-form-title">{title}</div>
          <div id="data-form-fields">
            <input
              id="data-form-media-count-value"
              type="number"
              value={progress || ''}
              onChange={(e): void => setProgress(+e.target.value)}
              placeholder={`${MEDIA_TYPE_SINGLETON_TERM[type]}s`}
              style={{
                border: `1px solid ${currentMediaColor()}`,
                backgroundColor: `${currentMediaColor()}1`,
              }}
            />
            {SHOULD_SCORE_MEDIA_STATUS[status] ? (
              <input
                id="data-form-score-value"
                type="number"
                value={score || ''}
                onChange={(e): void => setScore(+e.target.value)}
                placeholder="Score"
                style={{
                  border: `1px solid ${currentMediaColor()}`,
                  backgroundColor: `${currentMediaColor()}1`,
                }}
              />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

// DataForm.propTypes = {
//   title: PropTypes.string.isRequired,
//   image: PropTypes.string.isRequired,
//   color: PropTypes.string.isRequired,
//   type: PropTypes.string.isRequired,
//   token: PropTypes.string.isRequired,
//   mediaId: PropTypes.number.isRequired,
//   transitionCallback: PropTypes.func.isRequired,
//   presetProgress: PropTypes.number,
//   presetScore: PropTypes.number,
// };

export default DataForm;
