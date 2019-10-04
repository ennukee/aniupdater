import React from 'react';
import PropTypes from 'prop-types';

import './HelpMessage.css';

const HelpMessage = ({ substate, prevSubstate, helpMap }) => (helpMap[substate] || helpMap[prevSubstate]) && (
  <div id="help-message" className={substate}>
    {helpMap[substate] || helpMap[prevSubstate]}
  </div>
);

HelpMessage.propTypes = {
  substate: PropTypes.string.isRequired,
  prevSubstate: PropTypes.string.isRequired,
  helpMap: PropTypes.object.isRequired,
};

export default HelpMessage;
