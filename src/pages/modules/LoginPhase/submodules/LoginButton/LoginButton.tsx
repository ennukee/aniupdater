import React, { CSSProperties } from 'react';

import './LoginButton.scss';

interface LBProps {
  style?: CSSProperties;
  redirect?: string;
  content?: string;
}
const LoginButton = ({ style = {}, redirect, content }: LBProps): React.ReactElement => (
  <div id="login-button" className="text-border" style={style}>
    <a href={redirect}>{content}</a>
  </div>
);

export default LoginButton;
