/* Libraries */
import React, { Component } from 'react';

/* Modules */
import LoginButton from './modules/LoginButton';
import TokenInput from './modules/TokenInput';
import PageProgression from './modules/PageProgression';
import MediaTypeSelectionPhase from './modules/MediaTypeSelectionPhase';
import SearchItem from './modules/SearchItem';
import DataForm from './modules/DataForm';

/* Utils */
import generateQueryJson from './modules/util/generateQueryJson';
import * as consts from './modules/util/const';

/* Styles */
import './css/Main.css';
import fadePhases from './modules/util/fadePhases';
// Remind me to never try to write an entire single-page in a literal (mostly) single page again
//                                                                                             im sorry for your eyes

/*
    TODO LIST
  ! none
*/

const width = 500;

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
      searchResults: consts.NO_RESULTS_FOUND_RESPONSE,
      titleShowState: true,
      cachedSearchResults: {},
      page: 0,
      selectedMedia: {},
    };
    this.noResultsFoundResponse = consts.NO_RESULTS_FOUND_RESPONSE;
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
          <span className="green bold">↑</span>
          <span> to toggle titles, </span>
          <span className="cyan bold">← →</span>
          <span> to change pages or </span>
          <span className="aom-m bold">F1 through F4</span>
          <span> to select the media</span>
        </span>
      ),
      'data-phase': (
        <span>
          <span>Status keybinds: </span>
          <span className="green bold">N</span>
          <span> for new, </span>
          <span className="yellow bold">U</span>
          <span> for updating existing, </span>
          <span className="aom-m bold">C</span>
          <span> for completed, </span>
          <span className="aom-a bold">D</span>
          <span> for dropped, and </span>
          <span className="orange bold">H</span>
          <span> for something put on hold, </span>
        </span>
      ),
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  tokenSuccess = (resp) => {
    if (!resp.ok) {
      this.tokenFailure(resp);
      return;
    }
    // Response was successful, we now know the token is legitimate. Time to begin the real heavy-lifting.
    this.setState({ loginState: 'leaving' });
    setTimeout(
      () => this.setState({ loginState: 'left', mainState: 'preenter' }),
      750,
    );
    setTimeout(
      () => this.setState({ mainState: 'entering', substate: 'a-or-m-phase' }),
      752,
    );
  };

  tokenFailure = (e) => {
    console.log(e);
  };

  authorizeToken = (token) => {
    this.setState({ submitDisabled: true });
    const options = generateQueryJson(consts.VERIFICATION_QUERY, token);

    this.setState({ token });
    fetch(consts.ANILIST_BASE_URL, options).then(
      this.tokenSuccess,
      this.tokenFailure,
    );
  };

  transitionMainState = async (nextState) => {
    const { substate } = this.state;

    const oldPhaseElement = document.getElementById(substate);
    const newPhaseElement = document.getElementById(nextState);
    if (!oldPhaseElement || !newPhaseElement) {
      // Something went wrong, but we don't want to explode so just halt
      console.log(
        'Unable to find one of the phase elements:',
        oldPhaseElement,
        newPhaseElement,
      );
      return;
    }

    // Don't let any keypresses affect us during our transition state
    this.setState({ substate: 'TRANSITION', lastSubstate: substate });

    // Transition states
    await fadePhases(oldPhaseElement, newPhaseElement, 750);

    // Search for a focus target of the next phase if it exists
    const nextStartingElement = this.startingElementIdByPhase[nextState];
    if (nextStartingElement) {
      document.getElementById(nextStartingElement).focus(); // and focus it if it does
    }

    // Lastly, return us to a proper state to receive key commands
    this.setState({ substate: nextState });
  };

  handleKeyPress = (e) => {
    const {
      substate, titleShowState, search, type, token,
    } = this.state;
    console.log(e.key);
    switch (substate) {
      case 'a-or-m-phase':
        const { [e.key]: mediaType } = {
          a: 'ANIME', A: 'ANIME', m: 'MANGA', M: 'MANGA',
        };
        if (mediaType) {
          this.setState({ type: mediaType });
          this.transitionMainState('search-phase');
        }
        break;
      case 'search-phase':
        const searchBaseQuery = (newPage) => `query {
          Page(page: ${newPage}, perPage: 4) {
            pageInfo {
              total
            }
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
        switch (e.key) {
          case 'F1':
          case 'F2':
          case 'F3':
          case 'F4':
            const { 1: mediaIndex } = /F([1-4])/.exec(e.key); // Find and dynamically grab our F key press number
            this.selectMediaIndex(mediaIndex - 1);
            e.preventDefault();
            break;
          case 'ArrowUp':
            this.setState({ titleShowState: !titleShowState });
            break;
          case 'ArrowLeft':
            this.changeSearchPage(-1, searchBaseQuery);
            e.preventDefault();
            break;
          case 'ArrowRight':
            this.changeSearchPage(1, searchBaseQuery);
            e.preventDefault();
            break;
          case 'Enter':
            // Reset our search values back to nothing when performing a fresh search
            this.setState({ page: 1, cachedSearchResults: {} });

            const options = generateQueryJson(searchBaseQuery(1), token);
            this.initiateSearch(options, {
              extraState: {
                searchPages: (resp) => Math.min(10, Math.ceil(resp.data.Page.pageInfo.total / 4)),
              },
            });
            break;
          default:
            document.getElementById('search-input').focus();
            break;
        }
        break;
      case 'data-phase':
        const { [e.key.toLowerCase()]: mediaStatus } = {
          n: 'NEW', u: 'UPDATE', c: 'COMPLETED', d: 'DROPPED', h: 'HOLD',
        };
        if (mediaStatus) {
          this.setState({ mediaStatus });
        } else if (e.key === 'Enter') {
          // TODO: Submit the information to some POST request handler here
        }
        break;
      default:
        break;
    }
  };

  selectMediaIndex = (index) => {
    const { searchResults } = this.state;
    if (Object.keys(searchResults[index]).length === 0) {
      return; // Likely we tried to select something that isnt present on the last page of the search
    }
    this.setState({ selectedMedia: searchResults[index] });
    this.transitionMainState('data-phase');
  };

  searchResultParse = (resp, stateOptions) => {
    const {
      page = 1,
      direction = 0,
      cachedSearchResults = {},
      extraState = {},
    } = stateOptions;

    if (resp.data.Page.media.length === 0) {
      // If no results, default to your "no results" set
      this.setState({ searchResults: this.noResultsFoundResponse, searchPages: 0 });
    } else {
      this.setState({
        searchResults:
              resp.data.Page.media || this.noResultsFoundResponse,
        cachedSearchResults: {
          ...cachedSearchResults,
          [page + direction]: resp.data.Page.media,
        },
        // me: how do I go about accessing the response data in a call to this function before we have it
        // the world: callbacks!
        // me:
        ...Object.fromEntries(Object.entries(extraState).map(([key, cb]) => [key, cb(resp)])),
      });
    }
  }

  initiateSearch = (queryOptions, stateOptions) => {
    fetch(consts.ANILIST_BASE_URL, queryOptions)
      .then((resp) => resp.json())
      .then((resp) => {
        this.searchResultParse(resp, stateOptions);
      });
  }

  changeSearchPage = (direction, baseQueryCallback) => {
    const {
      cachedSearchResults, page, searchPages, token,
    } = this.state;
    if (page + direction < 1 || page + direction > searchPages) return; // No page 0s or extra queries :)

    this.setState({ page: page + direction });
    const query = baseQueryCallback(page + direction);

    if (cachedSearchResults[page + direction]) {
      console.log('Cached search results found, using those instead');
      this.setState({
        searchResults: cachedSearchResults[page + direction],
      });
    } else {
      const options = generateQueryJson(query, token);
      this.initiateSearch(options, {
        page,
        direction,
        cachedSearchResults,
      });
    }
  }

  render() {
    const {
      loginState,
      submitDisabled,
      mainState,
      substate,
      search,
      searchResults,
      titleShowState,
      lastSubstate,
      selectedMedia,
      searchPages,
      page,
      mediaStatus,
      type,
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
          {this.helpByPhase[substate] || this.helpByPhase[lastSubstate]}
        </div>
        <div id="main-phase" className={mainState}>
          <div id="a-or-m-phase" className="main-phase-item active">
            <MediaTypeSelectionPhase />
          </div>
          <div id="search-phase" className="main-phase-item inactive">
            <div id="page-slider">
              {page && searchPages ? <PageProgression maxPages={searchPages} page={page} /> : null}
            </div>
            <input
              type="text"
              id="search-input"
              placeholder="Title"
              value={search}
              onChange={(e) => this.setState({ search: e.target.value })}
            />
            <div
              id="results-view"
              className={`${
                searchResults.length === 0 ? 'inactive' : 'active'
              }`}
            >
              {searchResults.map((work) => (
                <SearchItem
                  key={work.id}
                  color={work.coverImage.color}
                  coverImage={work.coverImage.large}
                  title={work.title.userPreferred}
                  showTitle={titleShowState}
                />
              ))}
            </div>
          </div>
          <div id="data-phase" className="main-phase-item inactive">
            {substate === 'data-phase' ? (
              <DataForm
                title={selectedMedia.title.userPreferred}
                image={selectedMedia.coverImage.large}
                color={selectedMedia.coverImage.color}
                mediaStatus={mediaStatus}
                type={type}
              />
            ) : <div />}
          </div>
        </div>
      </div>
    );
  }
}
