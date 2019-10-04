import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const MediaTypeSelectionPhase = ({ transitionCallback }) => {
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

  return (
    <div>
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
};

export default MediaTypeSelectionPhase;
