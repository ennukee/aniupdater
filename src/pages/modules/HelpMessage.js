import React from 'react';
import PropTypes from 'prop-types';

const HelpMessage = ({ substate, prevSubstate, helpMap }) => (
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
