import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import MediaTypeSelectionPhase from './submodules/MediaTypeSelectionPhase';
import PageProgression from './submodules/PageProgression';
import SearchItem from './submodules/SearchItem';
import DataForm from './submodules/DataForm';

import fadePhases from '../util/fadePhases';
import generateQueryJson from '../util/generateQueryJson';
import * as consts from '../util/const';

const MainPhase = ({ token, mainState }) => {
  const [substate, setSubstate] = useState('a-or-m-phase');
  const [prevSubstate, setPrevSubstate] = useState('');
  const [titleShowState, setTitleShowState] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');

  const [searchResults, setSearchResults] = useState(consts.NO_RESULTS_FOUND_RESPONSE);
  const [page, setPage] = useState(0);
  const [searchPages, setSearchPages] = useState(10);
  const [selectedMedia, setSelectedMedia] = useState({});

  const [cachedSearchResults, setCachedSearchResults] = useState({});

  const noResultsFoundResponse = consts.NO_RESULTS_FOUND_RESPONSE;

  const transitionMainState = useCallback(async (nextState) => {
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
    setPrevSubstate(substate);
    setSubstate('TRANSITION');

    // Transition states
    await fadePhases(oldPhaseElement, newPhaseElement, 750);

    // Search for a focus target of the next phase if it exists
    const nextStartingElement = consts.FOCUS_ELEMENT_BY_PHASE[nextState];
    if (nextStartingElement) {
      document.getElementById(nextStartingElement).focus(); // and focus it if it does
    }

    // Lastly, return us to a proper state to receive key commands
    setSubstate(nextState);
  }, [substate]);

  const selectMediaIndex = useCallback((index) => {
    if (Object.keys(searchResults[index]).length === 0) {
      return; // Likely we tried to select something that isnt present on the last page of the search
    }
    setSelectedMedia(searchResults[index]);
    transitionMainState('data-phase');
  }, [searchResults, transitionMainState]);

  const searchResultParse = useCallback((resp, stateOptions) => {
    const {
      // page = 1,
      direction = 0,
      // cachedSearchResults = {},
      // extraState = {},
    } = stateOptions;

    if (resp.data.Page.media.length === 0) {
      // If no results, default to your "no results" set
      setSearchResults(noResultsFoundResponse);
      setSearchPages(0);
    } else {
      setSearchResults(resp.data.Page.media || noResultsFoundResponse);
      setCachedSearchResults({ ...cachedSearchResults, [page + direction]: resp.data.Page.media });
      // this.setState({
      //   searchResults:
      //         resp.data.Page.media || noResultsFoundResponse,
      //   cachedSearchResults: {
      //     ...cachedSearchResults,
      //     [page + direction]: resp.data.Page.media,
      //   },
      //   // me: how do I go about accessing the response data in a call to this function before we have it
      //   // the world: callbacks!
      //   // me:
      //   ...Object.fromEntries(Object.entries(extraState).map(([key, cb]) => [key, cb(resp)])),
      // });
    }
  }, [cachedSearchResults, noResultsFoundResponse, page]);

  const initiateSearch = useCallback((queryOptions, stateOptions) => {
    fetch(consts.ANILIST_BASE_URL, queryOptions)
      .then((resp) => resp.json())
      .then((resp) => {
        searchResultParse(resp, stateOptions);
      });
  }, [searchResultParse]);

  const changeSearchPage = useCallback((direction, baseQueryCallback) => {
    if (page + direction < 1 || page + direction > searchPages) return; // No page 0s or extra queries :)

    const query = baseQueryCallback(page + direction);
    if (cachedSearchResults[page + direction]) {
      console.log('Cached search results found, using those instead');
      setSearchResults(cachedSearchResults[page + direction]);
    } else {
      const options = generateQueryJson(query, token);
      initiateSearch(options, {
        page,
        direction,
        cachedSearchResults,
      });
    }
    setPage(page + direction);
  }, [cachedSearchResults, initiateSearch, page, searchPages, token]);

  const handleKeyPress = useCallback((e) => {
    console.log(e.key);
    switch (substate) {
      case 'a-or-m-phase':
        const { [e.key]: mediaType } = {
          a: 'ANIME', A: 'ANIME', m: 'MANGA', M: 'MANGA',
        };
        if (mediaType) {
          setType(mediaType);
          transitionMainState('search-phase');
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
            selectMediaIndex(mediaIndex - 1);
            e.preventDefault();
            break;
          case 'ArrowUp':
            setTitleShowState(!titleShowState);
            break;
          case 'ArrowLeft':
            changeSearchPage(-1, searchBaseQuery);
            e.preventDefault();
            break;
          case 'ArrowRight':
            changeSearchPage(1, searchBaseQuery);
            e.preventDefault();
            break;
          case 'Enter':
            // Reset our search values back to nothing when performing a fresh search
            setPage(1);
            setCachedSearchResults({});

            const options = generateQueryJson(searchBaseQuery(1), token);
            initiateSearch(options, {
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
      default:
        break;
    }
  },
  [changeSearchPage, initiateSearch, search, selectMediaIndex, substate,
    titleShowState, token, transitionMainState, type]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
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
          onChange={(e) => setSearch(e.target.value)}
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
            mediaId={selectedMedia.id}
            title={selectedMedia.title.userPreferred}
            image={selectedMedia.coverImage.large}
            color={selectedMedia.coverImage.color}
            type={type}
            token={token}
          />
        ) : <div />}
      </div>
    </div>
  );
};

MainPhase.propTypes = {
  token: PropTypes.string.isRequired,
  mainState: PropTypes.string.isRequired,
};

export default MainPhase;
