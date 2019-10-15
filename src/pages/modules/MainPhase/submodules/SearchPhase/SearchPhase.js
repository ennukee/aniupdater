import React, {
  useState, useEffect, useCallback,
} from 'react';
import PropTypes from 'prop-types';

import SearchItem from './submodules/SearchItem';
import PageProgression from './submodules/PageProgression';

import searchQueryBase from './util/searchQueryBase';
import generateQueryJson from '../../../util/generateQueryJson';
import * as consts from '../../../util/const';

const SearchPhase = ({ transitionCallback, token, type }) => {
  const [search, setSearch] = useState('');
  const [showTitles, setShowTitles] = useState(true);
  const [searchResults, setSearchResults] = useState(consts.NO_RESULTS_FOUND_RESPONSE);
  const [page, setPage] = useState(1);
  const [searchPages, setSearchPages] = useState(0);
  const [cachedSearchResults, setCachedSearchResults] = useState({});
  const [isFlatView, setIsFlatView] = useState(() => window.innerWidth / window.innerHeight < 1.65);

  const selectMediaIndex = useCallback((index) => {
    if (Object.keys(searchResults[index]).length === 0) {
      return; // Likely we tried to select something that isnt present on the last page of the search
    }
    // setSelectedMedia(searchResults[index]);
    transitionCallback(searchResults[index]);
  }, [searchResults, transitionCallback]);

  const searchResultParse = useCallback((resp, stateOptions) => {
    const {
      // page = 1,
      direction = 0,
      // cachedSearchResults = {},
      extraState = {},
    } = stateOptions;

    if (resp.data.Page.media.length === 0) {
      // If no results, default to your "no results" set
      setSearchResults(consts.NO_RESULTS_FOUND_RESPONSE);
      setSearchPages(0);
    } else {
      setSearchResults(resp.data.Page.media || consts.NO_RESULTS_FOUND_RESPONSE);
      setCachedSearchResults({ ...cachedSearchResults, [page + direction]: resp.data.Page.media });
      if (extraState.searchPages) {
        setSearchPages(Math.min(10, Math.ceil(resp.data.Page.pageInfo.total / 4)));
      }
    }
  }, [cachedSearchResults, page]);

  const initiateSearch = useCallback((queryOptions, stateOptions) => {
    fetch(consts.ANILIST_BASE_URL, queryOptions)
      .then((resp) => resp.json())
      .then((resp) => {
        searchResultParse(resp, stateOptions);
      });
  }, [searchResultParse]);

  const changeSearchPage = useCallback((direction, baseQueryCallback) => {
    if (page + direction < 1 || page + direction > searchPages) return; // No page 0s or extra queries :)

    const query = baseQueryCallback(page + direction, search, type);
    console.table(cachedSearchResults);
    console.log(page, direction, page + direction);
    if (cachedSearchResults[page + direction]) {
      console.log('Cached search results found, using those instead');
      setSearchResults(cachedSearchResults[page + direction]);
    } else {
      console.log('No cached search result, querying...');
      const options = generateQueryJson(query, token);
      initiateSearch(options, {
        page,
        direction,
        cachedSearchResults,
      });
    }
    setPage(page + direction);
  }, [cachedSearchResults, initiateSearch, page, search, searchPages, token, type]);

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
      case 'ArrowUp':
        setShowTitles(!showTitles);
        e.preventDefault();
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
        // Reset our search values back to nothing when performing a fresh search
        setPage(1);
        setCachedSearchResults({});

        const options = generateQueryJson(searchQueryBase(1, search, type), token);
        initiateSearch(options, {
          extraState: {
            searchPages: true,
          },
        });
        break;
      default:
        document.getElementById('search-input').focus();
        break;
    }
  }, [changeSearchPage, initiateSearch, search, selectMediaIndex, showTitles, token, type]);

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
    document.getElementById('search-phase').focus();
    window.addEventListener('resize', updateWindowSize);
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  // const gridProps = useSpring({
  //   gridTemplateColumns: `${showTitles ? 0.50 : 0.25}fr ${showTitles ? 0.50 : 0.25}fr ${showTitles ? 0 : 0.25}fr ${showTitles ? 0 : 0.25}fr`,
  // });

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
