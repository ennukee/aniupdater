import React, { Component } from 'react'
import LoginButton from './modules/LoginButton'
import TokenInput from './modules/TokenInput'
import './css/Main.css';

const width = 500;
const ANILIST_BASE_URL = 'https://graphql.anilist.co';

export default class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      token: '',
      submitActive: false,
      loginState: '',
      mainState: 'not-entered',

      // main phase data
      substate: 'TRANSITION',
      type: '',
      search: '',
      searchResults: []
    }
    this.startingElementIdByPhase = {
      'search-phase': 'search-input',
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress)
  }

  handleVerifyResponse = async resp => {
    if (!resp.ok) {
      this.handleVerifyError(resp)
      return
    }
    // Response was successful, we now know the token is legitimate. Time to begin the real heavy-lifting.
    this.setState({loginState: 'leaving'})
    setTimeout(() => this.setState({loginState: 'left', mainState: 'preenter'}), 750)
    setTimeout(() => this.setState({mainState: 'entering', substate: 'a-or-m-phase'}), 752)
  }

  handleVerifyError = e => {
    this.setState({submitActive: true})
  }

  authorizeToken = token => {
    this.setState({submitDisabled: true})
    console.log(token)
    // Construct the simplest query possible for token verification
    const query = `query {
      Media(id: 1) {
        title {
          english
        }
      }
    }
    `
    const options = this.generateQueryJson(query, token)

    this.setState({token})
    fetch(ANILIST_BASE_URL, options)
      .then(this.handleVerifyResponse, this.handleVerifyError)

  }

  transitionMainState = async nextState => {
    const oldPhaseElement = document.getElementById(this.state.substate)
    const newPhaseElement = document.getElementById(nextState)
    if (!oldPhaseElement || !newPhaseElement) { // Something went wrong, but we don't want to explode so just halt
      console.log('Unable to find one of the phase elements:', oldPhaseElement, newPhaseElement)
      return
    }

    // Don't let any keypresses affect us during our transition state
    this.setState({substate: 'TRANSITION'}) 

    // Begin the manual transition animations (where's GSAP at tho)
    oldPhaseElement.classList.replace('active', 'leaving')
    setTimeout(() => {
      oldPhaseElement.classList.replace('leaving', 'inactive')
      newPhaseElement.classList.replace('inactive', 'preenter')
    }, 740)
    setTimeout(() => {
      newPhaseElement.classList.replace('preenter', 'active')
    }, 752)
    setTimeout(() => { // After the animations, autofocus any element we specify (if applicable)
      const nextStartingElement = this.startingElementIdByPhase[nextState]
      if (nextStartingElement) {
        document.getElementById(nextStartingElement).focus()
      }
    }, 1500)

    // Return the state back to normal once we finish transitioning
    this.setState({substate: nextState}) 
  }

  handleKeyPress = e => {
    switch (this.state.substate) {
      case 'a-or-m-phase':
        if (e.key === 'a') {
          this.setState({type: 'ANIME'})
          this.transitionMainState('search-phase')
        }
        if (e.key === 'm') {
          this.setState({type: 'MANGA'})
          this.transitionMainState('search-phase')
        }
        break;
      case 'search-phase':
        // console.log(e.key)
        if (e.key === 'Enter') {
          // console.log(this.state.search, this.state.type)
          const query = `query {
            Page(page: 1, perPage: 4) {
              media(search: "${this.state.search}", type: ${this.state.type}) {
                title {
                  userPreferred
                }
                coverImage {
                  large
                  color
                }
              }
            }
          }`
          console.log(query)
          const options = this.generateQueryJson(query)
          fetch(ANILIST_BASE_URL, options) 
            .then(resp => resp.json())
            .then(resp => this.setState({searchResults: resp.data.Page.media}))
        }
        break;
      default:
        break;
    }
  }

  generateQueryJson = (query, token = this.state.token) => {
    return {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query
      })
    }
  }

  render() {
    return (
      <div id='app'>
        <div id='login-phase' className={this.state.loginState} style={{
          width,
        }}>
          <TokenInput 
            callback={token => this.authorizeToken(token)}
            disabled={this.state.submitDisabled}/>
          <LoginButton 
            content='No token? Click here to sign in.'
            redirect='https://anilist.co/api/v2/oauth/authorize?client_id=2599&response_type=token'
            style={{
              width,
            }}
            />
        </div>
        <div id='main-phase' className={this.state.mainState}>
            <div id='a-or-m-phase' className='main-phase-item active'>
              <span id='aom-a'><span className='bold dark'>A</span>nq</span> or <span id='aom-m'><span className='bold dark'>M</span>ar</span>
            </div>
            <div id='search-phase' className='main-phase-item inactive'>
              <input 
                type='text'
                id='search-input'
                placeholder='Title'
                autoFocus=''
                value={this.state.search}
                onChange={e => this.setState({search: e.target.value})}/>
              <div id='results-view'>
                {this.state.searchResults.map((work, index) => (
                  <div id='results-item'>
                    <img src={work.coverImage.large} alt='Cover'></img>
                    {/* <div key={index}>{work.title.userPreferred}</div> */}
                  </div>
                ))}
              </div>
            </div>
        </div>
      </div>
    )
  }
}
