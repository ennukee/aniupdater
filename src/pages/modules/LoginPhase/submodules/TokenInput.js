import React, { useState } from 'react';
import './TokenInput.css';
import PropTypes from 'prop-types';

const TokenInput = ({ callback, disabled }) => {
  const [inputVal, setInputVal] = useState('');
  return (
    <div id="input-container">
      <input
        id="token-input"
        type="text"
        placeholder="AniList Token"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
      />
      <input
        id="token-submit"
        type="button"
        value="✓"
        onClick={() => callback(inputVal)}
        disabled={disabled}
      />
    </div>
  );
};

export default TokenInput;

TokenInput.propTypes = {
  callback: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};
