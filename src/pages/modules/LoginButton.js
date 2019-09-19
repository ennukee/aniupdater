import React from 'react';
import './css/LoginButton.css'

const LoginButton = props => {
    return (
        <div id='login-button' style={props.style}>
            <a href={props.redirect}>
                {props.content}
            </a>
        </div>
    )
}

export default LoginButton
