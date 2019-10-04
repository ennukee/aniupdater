/* Libraries */
import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

/* Modules */
import SearchPhase from './submodules/SearchPhase/SearchPhase';
import MediaTypeSelectionPhase from './submodules/MediaTypeSelectionPhase';
import DataForm from './submodules/DataForm';
import HelpMessage from './submodules/HelpMessage';

/* Custom Hooks */
import useHelpMap from './util/useHelpMap';
import useShiftModifier from './util/useShiftModifier';

/* Utils */
import fadePhases from '../util/fadePhases';

const MainPhase = ({ token, mainState }) => {
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

  const { isShifting } = useShiftModifier();
  const handleKeyPress = useCallback((e) => {
    console.log(e.key, isShifting);
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

        <div id="a-or-m-phase" className="main-phase-item active">
          {substate === 'a-or-m-phase' && (
            <MediaTypeSelectionPhase
              transitionCallback={mediaTypeSelectionHandler}
            />
          )}
        </div>

        <div id="search-phase" className="main-phase-item inactive">
          {substate === 'search-phase' && (
            <SearchPhase
              token={token}
              type={type}
              transitionCallback={searchSelectionHandler}
            />
          )}
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
    </>
  );
};

MainPhase.propTypes = {
  token: PropTypes.string.isRequired,
  mainState: PropTypes.string.isRequired,
};

export default MainPhase;
