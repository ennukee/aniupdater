import React, { Component } from 'react'
import LoginButton from './modules/LoginButton'
import TokenInput from './modules/TokenInput'
import './css/Main.css';

const width = 350;

export default class Main extends Component {
  render() {
    return (
      <div id='app'>
        <div id='login-phase' style={{
          width,
        }}>
          <TokenInput />
          <LoginButton 
            content='Click here to get your AniList token'
            redirect='https://anilist.co/api/v2/oauth/authorize?client_id=2599&response_type=token'
            style={{
              width,
            }}
            />
        </div>
      </div>
    )
  }
}
