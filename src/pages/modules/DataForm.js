import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './css/DataForm.css';

export default class DataForm extends Component {
  constructor(props) {
    super(props);
    this.mediaStatusColors = {
      NEW: '#6c6',
      UPDATE: '#cc6',
      COMPLETED: '#66c',
      DROPPED: '#c66',
      HOLD: '#fb6',
    };
    this.mediaTypeSingletonTerm = {
      ANIME: 'Episode',
      MANGA: 'Chapter',
    };
    this.scoreEnabledByMediaStatus = {
      NEW: false,
      UPDATE: false,
      COMPLETED: true,
      DROPPED: true,
      HOLD: true,
    };
  }

  componentDidMount() {
    // Set Enter key callback listener
    document.getElementById('data-form-media-count-value').focus();
  }

  componentWillUnmount() {
    // Remove callback listener
  }

  currentMediaColor = () => {
    const { mediaStatus } = this.props;
    return this.mediaStatusColors[mediaStatus] || '#222';
  }

  render() {
    const {
      title, color, image, type, mediaStatus,
    } = this.props;
    return (
      <div id="data-form-container">
        <div
          id="data-form-image"
          style={{
            backgroundColor: `#${`${Math.floor(
              Math.random() * 9,
            )}`.repeat(6)}`,
            border: `1px solid ${this.currentMediaColor()}`,
          }}
        />
        <div
          id="data-form-content"
          style={{
            border: `1px solid ${this.currentMediaColor()}`,
          }}
        >
          <div id="data-form-title">{title}</div>
          <div id="data-form-fields">
            <input
              id="data-form-media-count-value"
              type="number"
              placeholder={`${this.mediaTypeSingletonTerm[type]}`}
              style={{
                border: `1px solid ${this.currentMediaColor()}`,
                backgroundColor: `${this.currentMediaColor()}1`,
              }}
            />
            {this.scoreEnabledByMediaStatus[mediaStatus] ? (
              <input
                id="data-form-score-value"
                type="number"
                placeholder="Score"
                style={{
                  border: `1px solid ${this.currentMediaColor()}`,
                  backgroundColor: `${this.currentMediaColor()}1`,
                }}
              />
            ) : null}

          </div>
        </div>
      </div>
    );
  }
}

DataForm.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  mediaStatus: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};
