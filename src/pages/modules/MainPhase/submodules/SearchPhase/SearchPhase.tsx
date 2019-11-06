import React, { useState, useEffect, useCallback, useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { IoIosSearch } from 'react-icons/io';

import SearchItem from './submodules/SearchItem/SearchItem';
import PageProgression from './submodules/PageProgression/PageProgression';

import GlobalContext, { GlobalContextOptions } from 'Utils/GlobalContext';
import searchQueryBase from 'Utils/searchQueryBase';
import generateQueryJson from 'Utils/generateQueryJson';
import * as consts from 'Utils/const';
import useKeyModifiers from 'Utils/useKeyModifiers';
import presets from '../../../Alert/presets';

import { SearchResultParseExtra, MediaEntry, SearchResult } from 'interfaces/interfaces';

interface SPProps {
  transitionCallback: Function;
  token?: string;
  type?: string;
}
const SearchPhase = ({ transitionCallback, token = '', type = '' }: SPProps): React.ReactElement => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<MediaEntry[]>(consts.NO_RESULTS_FOUND_RESPONSE);
  const [page, setPage] = useState(1);
  const [searchPages, setSearchPages] = useState(0);
  const [isFlatView, setIsFlatView] = useState(() => window.innerWidth / window.innerHeight < 1.65);
  const { setGlobalValues }: GlobalContextOptions = useContext(GlobalContext);

  const { isCtrling, isShifting } = useKeyModifiers();

  const [cachedSearchResults, affectCachedSearchResults] = useReducer((state, action) => {
    // ? -> action = { type: 'WIPE_CACHE' }
    // ? -> action = { type: 'DELETE_QUERY', mediaType: 'ANIME', query: 'DEFABC' }
    // ? -> action = { query: "ABCDEF", mediaType: 'ANIME', page: 0, searchPages: 99, result: [...] }

    let newState;
    if (action.type === 'WIPE_CACHE') {
      newState = {};
      setGlobalValues &&
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
        ...state,
        [action.mediaType]: {
          ...Object.fromEntries(Object.entries(state[action.mediaType] || {}).filter(([k]) => k !== action.query)),
        },
      };
      setGlobalValues &&
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
        [action.mediaType]: {
          ...(state[action.mediaType] || {}),
          [action.query]: {
            searchPages: action.searchPages,
            // As well as persist existing page data about this query, defaulting in case
            // of us not knowing what this query is yet
            ...((state[action.mediaType] || {})[action.query] || {}),
            [action.page]: action.results,
          },
        },
      };
    }

    // Store this in localStorage so we can use it at a future point
    localStorage.setItem('cachedResults', JSON.stringify(newState));
    return newState;
  }, JSON.parse(localStorage.getItem('cachedResults') || '') || {});

  const handleBadRequest = useCallback((): void => {
    setGlobalValues &&
      setGlobalValues({
        type: 'ALERT',
        data: {
          active: true,
          content: 'Something went wrong with the request. The page will automatically refresh in 2 seconds.',
          duration: 2000,
          style: presets.red,
        },
      });
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }, [setGlobalValues]);

  const selectMediaIndex = useCallback(
    (index: number): void => {
      if (!searchResults[index] || Object.keys(searchResults[index]).length === 0) {
        return; // Likely we tried to select something that isnt present on the last page of the search
      }
      transitionCallback(searchResults[index]);
    },
    [searchResults, transitionCallback],
  );

  const searchResultParse = useCallback(
    (resp: SearchResult, { direction = 0, page: pageParsed = 0 }: SearchResultParseExtra): void => {
      if (!resp.data || !resp.data.Page) {
        // Something went horribly wrong in our query
        console.error('Something went wrong in the query: ', resp.errors);
        return handleBadRequest();
      }
      if (resp.data.Page.media.length === 0) {
        // If no results, default to your "no results" set
        setSearchResults(consts.NO_RESULTS_FOUND_RESPONSE);
        setSearchPages(0);
      } else {
        setSearchResults(resp.data.Page.media || consts.NO_RESULTS_FOUND_RESPONSE);
        affectCachedSearchResults({
          query: search,
          mediaType: type,
          page: pageParsed + direction,
          results: resp.data.Page.media,
          searchPages: Math.min(10, Math.ceil(resp.data.Page.pageInfo.total / 4)),
        });
        setSearchPages(Math.min(10, Math.ceil(resp.data.Page.pageInfo.total / 4)));
      }
    },
    [handleBadRequest, search, type],
  );

  const initiateSearch = useCallback(
    (queryOptions: RequestInit, { pageOverride = 0, direction = 0 }): boolean | null => {
      console.info(
        `Currently checking local cache for query = '${search}' on page index ${(pageOverride || page) + direction}...`,
      );
      // TODO: another candidate for optional chaining when supported
      if (
        cachedSearchResults[type] &&
        cachedSearchResults[type][search] &&
        cachedSearchResults[type][search][(pageOverride || page) + direction]
      ) {
        console.info('Found cached query, restoring it now');
        setSearchResults(cachedSearchResults[type][search][(pageOverride || page) + direction]);
        setSearchPages(cachedSearchResults[type][search].searchPages);
        setGlobalValues &&
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
        return true;
      }

      // 1 request per 2 seconds rate limiting logic on searches
      const lastSearchTime = +(localStorage.getItem('lastSearch') || 0);
      const timeElapsed = new Date().getTime() - lastSearchTime;
      if (timeElapsed < consts.LOCAL_RATE_LIMIT) {
        setGlobalValues &&
          setGlobalValues({
            type: 'ALERT',
            data: {
              active: true,
              content: `Slow down! Please try again in ${((consts.LOCAL_RATE_LIMIT - timeElapsed) / 1000).toFixed(
                1,
              )} second(s).`,
              duration: 1000,
              style: presets.white,
            },
            containerStyle: {
              top: '150px',
            },
          });
        return null;
      }

      console.error('Unable to find a cached query, sending new query out...');
      localStorage.setItem('lastSearch', '' + new Date().getTime());
      fetch(consts.ANILIST_BASE_URL, queryOptions)
        .then(resp => resp.json())
        .then(resp => {
          searchResultParse(resp, {
            page: pageOverride || page,
            direction,
          });
        })
        .catch(handleBadRequest);
      return true;
    },
    [search, page, cachedSearchResults, handleBadRequest, setGlobalValues, searchResultParse, type],
  );

  const changeSearchPage = useCallback(
    (direction: number, baseQueryCallback: Function): void => {
      if (page + direction < 1 || page + direction > searchPages) return; // No page 0s or extra queries :)

      const query = baseQueryCallback(page + direction, search, type);
      const options = generateQueryJson(query, token);
      const result = initiateSearch(options, {
        page,
        direction,
      });
      if (result) {
        setPage(page + direction);
      }
    },
    [initiateSearch, page, search, searchPages, token, type],
  );

  const handleKeyPress = useCallback(
    (e: KeyboardEvent): void => {
      switch (e.key) {
        case 'F1':
        case 'F2':
        case 'F3':
        case 'F4':
          const [, mediaIndex] = /F([1-4])/.exec(e.key); // Find and dynamically grab our F key press number
          selectMediaIndex(+mediaIndex - 1);
          e.preventDefault();
          break;
        case 'Delete':
          if (isShifting) {
            affectCachedSearchResults({
              type: 'DELETE_QUERY',
              mediaType: type,
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
          initiateSearch(options, { pageOverride: 1 });
          break;
        default:
          const searchInput = document.getElementById('search-input');
          searchInput && searchInput.focus();
          break;
      }
    },
    [changeSearchPage, initiateSearch, isCtrling, isShifting, search, selectMediaIndex, token, type],
  );

  const updateWindowSize = (): void => {
    if (window.innerWidth / window.innerHeight < 1.65) {
      setIsFlatView(true);
    } else {
      setIsFlatView(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return (): void => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    window.addEventListener('resize', updateWindowSize);
    return (): void => window.removeEventListener('resize', updateWindowSize);
  }, []);

  return (
    <>
      <div id="page-slider">
        <PageProgression maxPages={searchPages} page={page} />
      </div>
      <div id="search-input-container">
        <input
          type="text"
          id="search-input"
          aria-label="Media title search"
          placeholder="Title"
          value={search}
          onChange={(e): void => setSearch(e.target.value)}
        />
        <IoIosSearch
          size="2em"
          color="#222"
          style={{
            position: 'absolute' as 'absolute',
            left: '0',
            paddingRight: '3px',
            marginLeft: '15px',
            zIndex: 500,
          }}
        />
      </div>
      <div
        // style={gridProps}
        id="results-view"
        className={`${searchResults.length === 0 ? 'inactive' : 'active'}`}
      >
        {searchResults.map((work: MediaEntry, index: number) => (
          <SearchItem
            key={`work${work.id}`}
            index={index}
            color={work.coverImage ? work.coverImage.color : null}
            coverImage={work.coverImage ? work.coverImage.large : null}
            title={work.title.userPreferred}
            isFlatView={isFlatView}
            progress={work.mediaListEntry ? work.mediaListEntry.progress : null}
            maxProgress={work.episodes || work.chapters}
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
