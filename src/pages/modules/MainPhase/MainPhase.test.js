import React from 'react';
import { render, fireEvent, act, waitForElement, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import fetch from 'jest-fetch-mock';
import MainPhase from './MainPhase';
import { SEARCH_PHASE_MOCK_RESPONSE, SEARCH_PHASE_MOCK_RESPONSE_PARTIAL } from 'Utils/const';
import GlobalContext from 'Utils/GlobalContext.tsx';

describe('MainPhase.js', () => {
  const setup = () => {
    const setGlobalCallbackFn = jest.fn();
    const { container } = render(
      <GlobalContext.Provider
        value={{
          globalValues: {},
          setGlobalValues: setGlobalCallbackFn,
        }}
      >
        <MainPhase token="123123" mainState="entering" userId="123" username="321" />
      </GlobalContext.Provider>,
    );
    return { container };
  };

  // TODO: Send to Main.test.js when it is made (currently does not exist)
  it.skip('loads the alert upon initial render of phase', async () => {
    const { container } = setup();
    const alertContainer = await waitForElement(() => container.querySelector('#alert-container'));
    expect(alertContainer).not.toBeNull();
    await wait(() => expect(alertContainer).toHaveStyle('opacity: 1'));
  });

  it.skip('differentiates search caching between different media types', async () => {
    const { container } = setup();

    // Enter page and press A to select anime media
    await act(async () => {
      fireEvent.keyDown(document, { key: 'a', code: 65 });
    });
    // Then we wait for the search field to be found post-transition
    let input = await waitForElement(() => container.querySelector('input#search-input'));
    expect(input).not.toBeNull();

    // Afterwards, we mock a fetch and input "TEST" query
    await act(async () => {
      fetch.mockResponseOnce(JSON.stringify(SEARCH_PHASE_MOCK_RESPONSE));
      fireEvent.change(input, { target: { value: 'TEST' } });
    });
    fireEvent.keyDown(input, { key: 'Enter', code: 13 });
    localStorage.removeItem('lastSearch'); // We have a rate limit of 2s per request -- avoid it in tests

    // Then we wait for data phase to be loaded and check localStorage
    await waitForElement(() => container.querySelector('#data-phase'));
    // console.log(JSON.parse(window.localStorage.getItem('cachedResults')));
    expect(JSON.parse(window.localStorage.getItem('cachedResults')).ANIME.TEST).toBeDefined();
    expect(fetch.mock.calls.length).toBe(1);

    // Return to media selection via Shift+CapsLock keybind
    await act(async () => {
      fireEvent.keyDown(container, { key: 'Shift', code: 16 });
    });
    fireEvent.keyDown(container, { key: 'CapsLock', code: 20 });

    // Then select manga media type this time
    await waitForElement(() => document.querySelector('.aom-a'));
    await act(async () => {
      fireEvent.keyDown(container, { key: 'm', code: 77 });
    });

    // Wait for search phase to render again...
    input = await waitForElement(() => container.querySelector('input#search-input'));
    expect(input).not.toBeNull();

    // And repeat above, searching for "TEST" again
    await act(async () => {
      fetch.mockResponseOnce(JSON.stringify(SEARCH_PHASE_MOCK_RESPONSE_PARTIAL));
      fireEvent.change(input, { target: { value: 'TEST' } });
    });
    fireEvent.keyDown(input, { key: 'Enter', code: 13 });

    // Then we check for the same query as before but in the manga cache
    await waitForElement(() => container.querySelector('#data-phase'));
    // console.log(window.localStorage);
    expect(JSON.parse(window.localStorage.getItem('cachedResults')).MANGA.TEST).toBeDefined();
    expect(fetch.mock.calls.length).toBe(2);
  });
});
