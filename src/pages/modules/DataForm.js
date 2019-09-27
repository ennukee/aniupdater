import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  MEDIA_STATUS_COLORS,
  MEDIA_TYPE_SINGLETON_TERM,
  SHOULD_SCORE_MEDIA_STATUS,
  POST_MEDIA_CHANGE_QUERY_GEN,
  ANILIST_BASE_URL,
} from './util/const';
import generateQueryJson from './util/generateQueryJson';

import './css/DataForm.css';

const DataForm = ({
  title, image, color, type, token, mediaId,
}) => {
  const [status, setStatus] = useState('CURRENT');
  const [progress, setProgress] = useState();
  const [score, setScore] = useState();

  /* Key Press Event Handler */
  const handleKeyPress = useCallback((e) => {
    console.log(e);
    const { [e.key.toLowerCase()]: newStatus } = {
      u: 'CURRENT', c: 'COMPLETED', d: 'DROPPED', h: 'PAUSED',
    };
    if (newStatus) {
      setStatus(newStatus);
    } else if (e.key === 'Enter') {
      // TODO: Submit the information to some POST request handler here
      const options = generateQueryJson(POST_MEDIA_CHANGE_QUERY_GEN({
        mediaId, status, score, progress,
      }), token);
      console.log(options);
      fetch(ANILIST_BASE_URL, options)
        .then((resp) => resp.json())
        .then((resp) => {
          console.log(resp);
        });
    }
  }, [mediaId, progress, score, status, token]);

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
    <div id="data-form-container">
      <div
        id="data-form-image"
        style={{
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
  );
};

DataForm.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  mediaId: PropTypes.number.isRequired,
};

export default DataForm;
