import React, { Component } from 'react'
import LoginButton from './modules/LoginButton'
import TokenInput from './modules/TokenInput'
import './css/Main.css';

const width = 350;
const ANILIST_BASE_URL = 'https://graphql.anilist.co';

export default class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      submitActive: false,
    }
  }

  authorizeToken = token => {
    this.setState({submitDisabled: true})
    console.log(token)
    // Begin the graphQL query generation
    const options = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' 
      }
    }

  }

  render() {
    return (
      <div id='app'>
        <div id='login-phase' style={{
          width,
        }}>
          <TokenInput 
            callback={token => this.authorizeToken(token)}
            disabled={this.state.submitDisabled}/>
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
