import React from 'react';

const useHelpMap = () => {
  const helpByPhase = {
    'a-or-m-phase': (
      <span>
        Press&nbsp;
        <span className="aom-a bold">A</span>
        &nbsp;or&nbsp;
        <span className="aom-m bold">M</span>
        &nbsp;to select the media type
      </span>
    ),
    'search-phase': (
      <span>
        <span>Press </span>
        <span className="aom-a bold">Enter</span>
        <span> to submit your search, </span>
        <span className="green bold">↑</span>
        <span> to toggle titles, </span>
        <span className="cyan bold">← →</span>
        <span> to change pages or </span>
        <span className="aom-m bold">F1 through F4</span>
        <span> to select the media</span>
      </span>
    ),
    'data-phase': (
      <span>
        <span>Status keybinds: </span>
        <span className="green bold">U</span>
        <span> for updating existing, </span>
        <span className="aom-m bold">C</span>
        <span> for completed, </span>
        <span className="aom-a bold">D</span>
        <span> for dropped, and </span>
        <span className="orange bold">H</span>
        <span> for something put on hold, </span>
      </span>
    ),
  };
  return { helpByPhase };
};

export default useHelpMap;
