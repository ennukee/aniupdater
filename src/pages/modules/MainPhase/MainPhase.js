/* Libraries */
import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSpring, animated } from 'react-spring';

/* Modules */
import SearchPhase from './submodules/SearchPhase/SearchPhase';
import MediaTypeSelectionPhase from './submodules/MediaTypeSelectionPhase/MediaTypeSelectionPhase';
import DataForm from './submodules/DataForm/DataForm';
import HelpMessage from './submodules/HelpMessage/HelpMessage';

/* Custom Hooks */
import useHelpMap from './util/useHelpMap';
import useKeyModifiers from './util/useKeyModifiers';

/* Utils */
// import { ANILIST_BASE_URL, VIEWER_RELEVANT_MEDIA_QUERY_GEN } from '../util/const';
import fadePhases from '../util/fadePhases';
// import generateQueryJson from '../util/generateQueryJson';

const MainPhase = ({
  token, mainState, username,
}) => {
  const [substate, setSubstate] = useState('a-or-m-phase');
  const [prevSubstate, setPrevSubstate] = useState('');
  const [type, setType] = useState('');
  const [selectedMedia, setSelectedMedia] = useState({});

  const { helpByPhase: helpMap } = useHelpMap();

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

    // Lastly, return us to a proper state to receive key commands
    setSubstate(nextState);
  }, [substate]);

  const mediaTypeSelectionHandler = (newType) => {
    setType(newType);
    transitionMainState('search-phase');
  };

  const searchSelectionHandler = (newSelectedMedia) => {
    setSelectedMedia(newSelectedMedia);
    transitionMainState('data-phase');
  };

  const { isShifting } = useKeyModifiers();
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'CapsLock' && isShifting) {
      transitionMainState('a-or-m-phase');
    }
  }, [isShifting, transitionMainState]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const AOMProps = useSpring({
    opacity: substate === 'a-or-m-phase' ? 1 : 0,
  });
  const SearchProps = useSpring({
    opacity: substate === 'search-phase' ? 1 : 0,
  });
  const DataProps = useSpring({
    opacity: substate === 'data-phase' ? 1 : 0,
  });

  return (
    <>
      {mainState === 'entering' && (
        <HelpMessage
          substate={substate}
          prevSubstate={prevSubstate}
          helpMap={helpMap}
        />
      )}
      <div id="main-phase" className={mainState}>

        <animated.div id="a-or-m-phase" style={AOMProps} className="main-phase-item active">
          {substate === 'a-or-m-phase' && (
            <MediaTypeSelectionPhase
              transitionCallback={mediaTypeSelectionHandler}
              username={username}
            />
          )}
        </animated.div>

        <animated.div id="search-phase" style={SearchProps} className="main-phase-item inactive">
          {substate === 'search-phase' && (
            <SearchPhase
              token={token}
              type={type}
              transitionCallback={searchSelectionHandler}
            />
          )}
        </animated.div>

        <animated.div id="data-phase" style={DataProps} className="main-phase-item inactive">
          {substate === 'data-phase' ? (
            <DataForm
              mediaId={selectedMedia.id}
              title={selectedMedia.title.userPreferred}
              image={selectedMedia.coverImage.large}
              color={selectedMedia.coverImage.color}
              presetProgress={selectedMedia.mediaListEntry ? selectedMedia.mediaListEntry.progress : undefined}
              presetScore={selectedMedia.mediaListEntry ? selectedMedia.mediaListEntry.score : undefined}
              type={type}
              token={token}
              transitionCallback={() => transitionMainState('search-phase')}
            />
          ) : <div />}
        </animated.div>
      </div>
    </>
  );
};

MainPhase.propTypes = {
  token: PropTypes.string.isRequired,
  mainState: PropTypes.string.isRequired,
  username: PropTypes.string,
};

MainPhase.defaultProps = {
  username: '',
};

export default MainPhase;

/*
// Commented until I find a way to query a user's lists like you can query anime
useEffect(() => {
  if (!userId || !type) {
    return;
  }
  const queryBody = VIEWER_RELEVANT_MEDIA_QUERY_GEN(userId, type);
  const options = generateQueryJson(queryBody, token);
  fetch(ANILIST_BASE_URL, options)
    .then((resp) => resp.json())
    .then((resp) => {
      // Take the response from our query and transform it into a desirable form
      console.log(resp, queryBody);
      const watchingOrCompleted = resp.data.MediaListCollection.lists
        // First, filter out the Dropped / On-hold / Planning lists as we probably don't care
        .filter((list) => ['Reading', 'Completed', 'Watching'].includes(list.name))
        // Next, we reduce the two remaining arrays (either Reading / Completed or Watching / Completed) into one
        .reduce((acc, cur) => [...acc, ...cur.entries
          // And we make sure to map the objects (e.g. { mediaId: 125 }) down to just their value (e.g. 125)
          .map((obj) => obj.mediaId),
        ], []);

      console.log(watchingOrCompleted);
    });
}, [token, type, userId]);
*/
