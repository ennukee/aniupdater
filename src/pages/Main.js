import React, { Component } from 'react';
import LoginButton from './modules/LoginButton';
import TokenInput from './modules/TokenInput';
import './css/Main.css';

/*
    TODO LIST
  ! Handler for empty returns on search
*/

const width = 500;
const ANILIST_BASE_URL = 'https://graphql.anilist.co';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: undefined,
      submitDisabled: false,
      loginState: '',
      mainState: 'not-entered',

      // main phase data
      substate: 'TRANSITION',
      type: '',
      search: '',
      searchResults: [],
    };
    this.noResultsFoundResponse = [
      {
        id: 3,
        title: {
          userPreferred: 'S-senpai!',
        },
        coverImage: {
          large: '',
          color: '#e44',
        },
      },
      {
        id: 0,
        title: {
          userPreferred: "I'm sorry!",
        },
        coverImage: {
          large: '',
          color: '#e44',
        },
      },
      {
        id: 1,
        title: {
          userPreferred: 'No results were found!',
        },
        coverImage: {
          large: '',
          color: '#e44',
        },
      },
      {
        id: 2,
        title: {
          userPreferred: 'Please try another one!',
        },
        coverImage: {
          large: '',
          color: '#e44',
        },
      },
    ];
    this.startingElementIdByPhase = {
      'search-phase': 'search-input',
    };
    this.helpByPhase = {
      'a-or-m-phase': (
        <span>
          Click&nbsp;
          <span className="aom-a bold">A</span>
          &nbsp;or&nbsp;
          <span className="aom-m bold">M</span>
          &nbsp;to select the media type
        </span>
      ),
      'search-phase': (
        <span>
          <span>Press </span>
          <span className="aom-a bold">Enter</span>
          <span> to submit your search, </span>
          <span className="green bold">T</span>
          <span> to toggle titles, </span>
          <span className="cyan bold">← →</span>
          <span> to change pages or </span>
          <span className="aom-m bold">1 through 4</span>
          <span> to select the media</span>
        </span>
      ),
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  handleVerifyResponse = async (resp) => {
    if (!resp.ok) {
      this.handleVerifyError(resp);
      return;
    }
    // Response was successful, we now know the token is legitimate. Time to begin the real heavy-lifting.
    this.setState({ loginState: 'leaving' });
    setTimeout(() => this.setState({ loginState: 'left', mainState: 'preenter' }), 750);
    setTimeout(() => this.setState({ mainState: 'entering', substate: 'a-or-m-phase' }), 752);
  }

  handleVerifyError = (e) => {
    console.log(e);
  }

  authorizeToken = (token) => {
    this.setState({ submitDisabled: true });
    console.log(token);
    // Construct the simplest query possible for token verification
    const query = `query {
      Media(id: 1) {
        title {
          english
        }
      }
    }`;
    const options = this.generateQueryJson(query, token);
    console.log(options);

    this.setState({ token });
    fetch(ANILIST_BASE_URL, options)
      .then(this.handleVerifyResponse, this.handleVerifyError);
  }

  transitionMainState = async (nextState) => {
    const { substate } = this.state;

    const oldPhaseElement = document.getElementById(substate);
    const newPhaseElement = document.getElementById(nextState);
    if (!oldPhaseElement || !newPhaseElement) { // Something went wrong, but we don't want to explode so just halt
      console.log('Unable to find one of the phase elements:', oldPhaseElement, newPhaseElement);
      return;
    }

    // Don't let any keypresses affect us during our transition state
    this.setState({ substate: 'TRANSITION', lastSubstate: substate });

    // Begin the manual transition animations (where's GSAP at tho)
    oldPhaseElement.classList.replace('active', 'leaving');
    setTimeout(() => {
      oldPhaseElement.classList.replace('leaving', 'inactive');
      newPhaseElement.classList.replace('inactive', 'preenter');
      setTimeout(() => {
        newPhaseElement.classList.replace('preenter', 'active');
        setTimeout(() => { // Focus the element after we're sure it's on page
          const nextStartingElement = this.startingElementIdByPhase[nextState];
          if (nextStartingElement) {
            document.getElementById(nextStartingElement).focus();
          }
          this.setState({ substate: nextState });
        }, 250);
      }, 10);
    }, 740);
  }

  handleKeyPress = (e) => {
    const {
      substate, titleShowState, search, type,
    } = this.state;
    switch (substate) {
      case 'a-or-m-phase':
        if (e.key === 'a') {
          this.setState({ type: 'ANIME' });
          this.transitionMainState('search-phase');
        }
        if (e.key === 'm') {
          this.setState({ type: 'MANGA' });
          this.transitionMainState('search-phase');
        }
        break;
      case 'search-phase':
        // console.log(e.key)
        if (e.key === 't') {
          this.setState({ titleShowState: !titleShowState });
        }
        if (e.key === 'Enter') {
          // console.log(this.state.search, this.state.type)
          const query = `query {
            Page(page: 1, perPage: 4) {
              media(search: "${search}", type: ${type}) {
                id
                title {
                  userPreferred
                }
                coverImage {
                  large
                  color
                }
              }
            }
          }`;
          console.log(query);
          const options = this.generateQueryJson(query);
          fetch(ANILIST_BASE_URL, options)
            .then((resp) => resp.json())
            .then((resp) => {
              if (resp.data.Page.media.length === 0) {
                this.setState({ searchResults: this.noResultsFoundResponse });
              } else {
                this.setState({ searchResults: resp.data.Page.media || this.noResultsFoundResponse });
              }
            });
        }
        break;
      default:
        break;
    }
  }

  generateQueryJson = (query, providedToken) => {
    const { token = providedToken } = this.state;
    return {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query,
      }),
    };
  }

  render() {
    const {
      loginState, submitDisabled, mainState, substate, search, searchResults, titleShowState, lastSubstate,
    } = this.state;
    return (
      <div id="app">
        <div
          id="login-phase"
          className={loginState}
          style={{
            width,
          }}
        >
          <TokenInput
            callback={(token) => this.authorizeToken(token)}
            disabled={submitDisabled}
          />
          <LoginButton
            content="No token? Click here to sign in."
            redirect="https://anilist.co/api/v2/oauth/authorize?client_id=2599&response_type=token"
            style={{
              width,
            }}
          />
        </div>

        <div id="help-message" className={substate}>
          { this.helpByPhase[substate] || this.helpByPhase[lastSubstate] }
        </div>
        <div id="main-phase" className={mainState}>
          <div id="a-or-m-phase" className="main-phase-item active">
            <span className="aom-a">
              <span className="bold dark">A</span>
              nq
            </span>
            &nbsp;or&nbsp;
            <span className="aom-m">
              <span className="bold dark">M</span>
              ar
            </span>
          </div>
          <div id="search-phase" className="main-phase-item inactive">
            <input
              type="text"
              id="search-input"
              placeholder="Title"
              value={search}
              onChange={(e) => this.setState({ search: e.target.value })}
            />
            <div id="results-view" className={`${searchResults.length === 0 ? 'inactive' : 'active'}`}>
              {searchResults.map((work) => (
                <div id="results-item" key={work.id}>
                  {titleShowState ? (
                    <div
                      id="result-item-title"
                      style={{
                        color: work.coverImage.color,
                      }}
                    >
                      {work.title.userPreferred}
                    </div>
                  ) : (<div />)}
                  <div
                    className="img"
                    style={{
                    // backgroundImage: `url('${work.coverImage.large}')`
                      border: `1px solid ${work.coverImage.color}`,
                      backgroundColor: `#${(`${Math.floor(Math.random() * 9)}`).repeat(6)}`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
