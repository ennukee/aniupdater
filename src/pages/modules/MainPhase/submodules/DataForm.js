import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Alert from '../util/Alert';
import {
  MEDIA_STATUS_COLORS,
  MEDIA_TYPE_SINGLETON_TERM,
  SHOULD_SCORE_MEDIA_STATUS,
  POST_MEDIA_CHANGE_QUERY_GEN,
  ANILIST_BASE_URL,
  MEDIA_STATUS_ALERT_MESSAGES,
} from '../../util/const';
import generateQueryJson from '../../util/generateQueryJson';

import './DataForm.css';

const DataForm = ({
  title, image, color, type, token, mediaId, transitionCallback, presetProgress, presetScore,
}) => {
  const [status, setStatus] = useState('CURRENT');
  const [progress, setProgress] = useState(presetProgress);
  const [score, setScore] = useState(presetScore);
  const [alertActive, setAlertActive] = useState(false);

  /* Key Press Event Handler */
  const handleKeyPress = useCallback((e) => {
    const { [e.key.toLowerCase()]: newStatus } = {
      u: 'CURRENT', c: 'COMPLETED', d: 'DROPPED', h: 'PAUSED',
    };
    if (newStatus) {
      setAlertActive(MEDIA_STATUS_ALERT_MESSAGES[newStatus]);
      setTimeout(() => {
        setAlertActive(null);
      }, 1000);
      setStatus(newStatus);
    } else if (e.key === 'Enter') {
      const options = generateQueryJson(POST_MEDIA_CHANGE_QUERY_GEN({
        mediaId, status, score, progress,
      }), token);
      fetch(ANILIST_BASE_URL, options)
        .then((resp) => resp.json())
        .then(() => {
          transitionCallback(); // return to search phase
        });
    }
  }, [mediaId, progress, score, status, token, transitionCallback]);

  /* Get current media status color or default to black */
  const currentMediaColor = () => MEDIA_STATUS_COLORS[status] || '#222';

  /* Event handling setup and initial form focus */
  useEffect(() => {
    document.getElementById('data-form-media-count-value').focus();
    document.addEventListener('keydown', handleKeyPress);

    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  /* Rendering */
  return (
    <>
      <div id="data-form-container">
        <Alert
          active={alertActive}
          content={alertActive}
          style={{
            border: `1px solid ${currentMediaColor()}`,
            backgroundColor: `${currentMediaColor()}3`,
          }}
        />
        <div
          id="data-form-image"
          style={{
            // backgroundImage: `url('${image}')`,
            backgroundColor: `#${`${Math.floor(
              Math.random() * 9,
            )}`.repeat(6)}`,
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
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
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
                value={score}
                onChange={(e) => setScore(e.target.value)}
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

DataForm.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  mediaId: PropTypes.number.isRequired,
  transitionCallback: PropTypes.func.isRequired,
  presetProgress: PropTypes.number,
  presetScore: PropTypes.number,
};

DataForm.defaultProps = {
  presetProgress: undefined,
  presetScore: undefined,
};

export default DataForm;
