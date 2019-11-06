/* Libraries */
import React, { useState, useCallback, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

/* Modules */
import SearchPhase from './submodules/SearchPhase/SearchPhase';
import MediaTypeSelectionPhase from './submodules/MediaTypeSelectionPhase/MediaTypeSelectionPhase';
import DataForm from './submodules/DataForm/DataForm';
import HelpMessage from './submodules/HelpMessage/HelpMessage';

/* Custom Hooks */
import useHelpMap from 'Utils/useHelpMap';

/* Utils */
// import { ANILIST_BASE_URL, VIEWER_RELEVANT_MEDIA_QUERY_GEN } from '../util/const';
import fadePhases from 'Utils/fadePhases';
// import generateQueryJson from '../util/generateQueryJson';
import { MediaEntry } from 'interfaces/interfaces';

import './MainPhase.scss';

interface MPProps {
  token?: string;
  mainState?: string;
  username?: string;
}
const MainPhase = ({ token, mainState, username = '' }: MPProps): React.ReactElement => {
  const [substate, setSubstate] = useState('a-or-m-phase');
  const [prevSubstate, setPrevSubstate] = useState('');
  const [type, setType] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<MediaEntry>({
    id: 0,
    title: { userPreferred: '' },
    coverImage: { large: '', color: '' },
    mediaListEntry: null,
  });

  const { helpByPhase: helpMap } = useHelpMap();

  const transitionMainState = useCallback(
    async (nextState: string): Promise<void> => {
      const oldPhaseElement = document.getElementById(substate);
      const newPhaseElement = document.getElementById(nextState);
      if (!oldPhaseElement || !newPhaseElement) {
        // Something went wrong, but we don't want to explode so just halt
        console.log('Unable to find one of the phase elements:', oldPhaseElement, newPhaseElement);
        return;
      }

      // Don't let any keypresses affect us during our transition state
      setPrevSubstate(substate);
      setSubstate('TRANSITION');

      // Transition states
      await fadePhases(oldPhaseElement, newPhaseElement, 750);

      // Lastly, return us to a proper state to receive key commands
      setSubstate(nextState);
    },
    [substate],
  );

  const mediaTypeSelectionHandler = (newType: string): void => {
    setType(newType);
    transitionMainState('search-phase');
  };

  const searchSelectionHandler = (newSelectedMedia: MediaEntry): void => {
    setSelectedMedia(newSelectedMedia);
    transitionMainState('data-phase');
  };

  const handleKeyPress = useCallback(
    (e: KeyboardEvent): void => {
      // console.log(e.key, isShifting)
      if (e.key === 'Tab' && e.shiftKey) {
        transitionMainState('a-or-m-phase');
      }
    },
    [transitionMainState],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return (): void => {
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
      {mainState === 'entering' && <HelpMessage substate={substate} prevSubstate={prevSubstate} helpMap={helpMap} />}
      <div id="main-phase" className={mainState}>
        <animated.div id="a-or-m-phase" style={AOMProps} className="main-phase-item active">
          {substate === 'a-or-m-phase' && (
            <MediaTypeSelectionPhase transitionCallback={mediaTypeSelectionHandler} username={username} />
          )}
        </animated.div>

        <animated.div id="search-phase" style={SearchProps} className="main-phase-item inactive">
          {substate === 'search-phase' && (
            <SearchPhase token={token} type={type} transitionCallback={searchSelectionHandler} />
          )}
        </animated.div>

        <animated.div id="data-phase" style={DataProps} className="main-phase-item inactive">
          {substate === 'data-phase' ? (
            <DataForm
              mediaId={selectedMedia.id}
              title={selectedMedia.title.userPreferred}
              image={selectedMedia.coverImage ? selectedMedia.coverImage.large : null}
              presetProgress={selectedMedia.mediaListEntry ? selectedMedia.mediaListEntry.progress : undefined}
              presetScore={selectedMedia.mediaListEntry ? selectedMedia.mediaListEntry.score : undefined}
              type={type}
              token={token}
              transitionCallback={(): Promise<void> => transitionMainState('search-phase')}
            />
          ) : (
            <div />
          )}
        </animated.div>
      </div>
    </>
  );
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
