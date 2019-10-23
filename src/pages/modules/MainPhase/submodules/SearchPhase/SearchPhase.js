import React, {
  useState, useEffect, useCallback, useReducer, useContext,
} from 'react';
import PropTypes from 'prop-types';

import SearchItem from './submodules/SearchItem';
import PageProgression from './submodules/PageProgression';

import GlobalContext from '../../../util/GlobalContext';
import searchQueryBase from './util/searchQueryBase';
import generateQueryJson from '../../../util/generateQueryJson';
import * as consts from '../../../util/const';
import useKeyModifiers from '../../util/useKeyModifiers';
import { presets } from '../../../util/Alert';

const SearchPhase = ({ transitionCallback, token, type }) => {
  const [search, setSearch] = useState('');
  const [showTitles, setShowTitles] = useState(true);
  const [searchResults, setSearchResults] = useState(consts.NO_RESULTS_FOUND_RESPONSE);
  const [page, setPage] = useState(1);
  const [searchPages, setSearchPages] = useState(0);
  const [isFlatView, setIsFlatView] = useState(() => window.innerWidth / window.innerHeight < 1.65);
  const { setGlobalValues } = useContext(GlobalContext);

  const { isCtrling, isShifting } = useKeyModifiers();

  const [cachedSearchResults, affectCachedSearchResults] = useReducer((state, action) => {
    // ? -> action = { type: 'WIPE_CACHE' }
    // ? -> action = { type: 'DELETE_QUERY', query: 'DEFABC' }
    // ? -> action = { query: "ABCDEF", page: 0, searchPages: 99, result: [...] }

    let newState;
    if (action.type === 'WIPE_CACHE') {
      newState = {};
      setGlobalValues({
        type: 'ALERT',
        data: {
          active: true,
          content: 'Successfully erased all saved search results',
          style: presets.orange,
          containerStyle: {
            top: '150px',
          },
          duration: 2500,
        },
      });
    } else if (action.type === 'DELETE_QUERY') {
      newState = {
        ...Object.fromEntries(Object.entries(state).filter(([k]) => k !== action.query)),
      };
      setGlobalValues({
        type: 'ALERT',
        data: {
          active: true,
          content: `Successfully cleared known results for "${action.query}"`,
          style: presets.green,
          containerStyle: {
            top: '150px',
          },
          duration: 2500,
        },
      });
    } else {
      newState = {
        // Persist existing cached state
        ...state,
        [action.query]: {
          searchPages: action.searchPages,
          // As well as persist existing page data about this query, defaulting in case
          // of us not knowing what this query is yet
          ...state[action.query] || [],
          [action.page]: action.results,
        },
      };
    }

    // Store this in localStorage so we can use it at a future point
    localStorage.setItem('cachedResults', JSON.stringify(newState));
    return newState;
  }, JSON.parse(localStorage.getItem('cachedResults')) || {});

  const selectMediaIndex = useCallback((index) => {
    if (!searchResults[index] || Object.keys(searchResults[index]).length === 0) {
      return; // Likely we tried to select something that isnt present on the last page of the search
    }
    transitionCallback(searchResults[index]);
  }, [searchResults, transitionCallback]);

  const searchResultParse = useCallback((resp, stateOptions) => {
    const {
      direction = 0,
    } = stateOptions;

    if (resp.data.Page.media.length === 0) {
      // If no results, default to your "no results" set
      setSearchResults(consts.NO_RESULTS_FOUND_RESPONSE);
      setSearchPages(0);
    } else {
      setSearchResults(resp.data.Page.media || consts.NO_RESULTS_FOUND_RESPONSE);
      affectCachedSearchResults({
        query: search,
        page: page + direction,
        results: resp.data.Page.media,
        searchPages: Math.min(10, Math.ceil(resp.data.Page.pageInfo.total / 4)),
      });
      setSearchPages(Math.min(10, Math.ceil(resp.data.Page.pageInfo.total / 4)));
    }
  }, [page, search]);

  const initiateSearch = useCallback((queryOptions, { direction = 0 }) => {
    console.info(`Currently checking local cache for query = '${search}' on page index ${page + direction}...`);
    if (cachedSearchResults[search] && cachedSearchResults[search][page + direction]) {
      console.info('Found cached query, restoring it now');
      setSearchResults(cachedSearchResults[search][page + direction]);
      setSearchPages(cachedSearchResults[search].searchPages);
      setGlobalValues({
        type: 'ALERT',
        data: {
          active: true,
          content: 'You are viewing a cached result. To do a fresh search, do Shift + Delete',
          style: {
            ...presets.black,
            padding: '10px 20px',
          },
          containerStyle: {
            top: '150px',
          },
          duration: 1500,
        },
      });
      return;
    }

    console.error('Unable to find a cached query, sending new query out...');
    fetch(consts.ANILIST_BASE_URL, queryOptions)
      .then((resp) => resp.json())
      .then((resp) => {
        searchResultParse(resp, {
          page, direction, cachedSearchResults,
        });
      });
  }, [searchResultParse, cachedSearchResults, search, page]);

  const changeSearchPage = useCallback((direction, baseQueryCallback) => {
    if (page + direction < 1 || page + direction > searchPages) return; // No page 0s or extra queries :)

    const query = baseQueryCallback(page + direction, search, type);
    const options = generateQueryJson(query, token);
    initiateSearch(options, {
      page,
      direction,
    });
    setPage(page + direction);
  }, [initiateSearch, page, search, searchPages, token, type]);

  const handleKeyPress = useCallback((e) => {
    switch (e.key) {
      case 'F1':
      case 'F2':
      case 'F3':
      case 'F4':
        const { 1: mediaIndex } = /F([1-4])/.exec(e.key); // Find and dynamically grab our F key press number
        selectMediaIndex(mediaIndex - 1);
        e.preventDefault();
        break;
      case 'Delete':
        console.log(isShifting, isCtrling);
        if (isShifting) {
          affectCachedSearchResults({
            type: 'DELETE_QUERY',
            query: search,
          });
          e.preventDefault();
        } else if (isCtrling) {
          affectCachedSearchResults({
            type: 'WIPE_CACHE',
          });
          e.preventDefault();
        }
        break;
      case 'ArrowLeft':
        changeSearchPage(-1, searchQueryBase);
        e.preventDefault();
        break;
      case 'ArrowRight':
        changeSearchPage(1, searchQueryBase);
        e.preventDefault();
        break;
      case 'Enter':
        setPage(1);

        const options = generateQueryJson(searchQueryBase(1, search, type), token);
        initiateSearch(options, {});
        break;
      default:
        document.getElementById('search-input').focus();
        break;
    }
  }, [changeSearchPage, initiateSearch, isCtrling, isShifting, search, selectMediaIndex, token, type]);

  const updateWindowSize = () => {
    console.log(window.innerWidth / window.innerHeight);
    if (window.innerWidth / window.innerHeight < 1.65) {
      setIsFlatView(true);
    } else {
      setIsFlatView(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    window.addEventListener('resize', updateWindowSize);
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  return (
    <>
      <div id="page-slider">
        <PageProgression maxPages={searchPages} page={page} />
      </div>
      <input
        type="text"
        id="search-input"
        placeholder="Title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div
        // style={gridProps}
        id="results-view"
        className={`${
          searchResults.length === 0 ? 'inactive' : 'active'
        }`}
      >
        {searchResults.map((work, index) => (
          <SearchItem
            key={`work${work.id}`}
            index={index}
            color={work.coverImage.color}
            coverImage={work.coverImage.large}
            title={work.title.userPreferred}
            showTitle={showTitles}
            isFlatView={isFlatView}
          />
        ))}
      </div>
    </>
  );
};

SearchPhase.propTypes = {
  transitionCallback: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default SearchPhase;
