import React, { Component } from 'react';
import './css/TokenInput.css';
import PropTypes from 'prop-types';

export default class TokenInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputVal: '',
    };
  }

  render() {
    const { callback, disabled } = this.props;
    const { inputVal } = this.state;
    return (
      <div id="input-container">
        <input
          id="token-input"
          type="text"
          placeholder="AniList Token"
          value={inputVal}
          onChange={(e) => this.setState({ inputVal: e.target.value })}
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
  }
}

TokenInput.propTypes = {
  callback: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};
