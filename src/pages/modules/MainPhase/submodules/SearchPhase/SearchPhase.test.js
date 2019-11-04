import React from 'react';
import {
  render,
  fireEvent,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import fetch from 'jest-fetch-mock';
import SearchPhase from './SearchPhase';
import { SEARCH_PHASE_MOCK_RESPONSE, SEARCH_PHASE_MOCK_RESPONSE_PARTIAL } from '../../../util/const';
import GlobalContext from '../../../util/GlobalContext.tsx';

const setup = () => {
  const callbackFn = jest.fn();
  const setGlobalCallbackFn = jest.fn();
  const { container } = render(
    <GlobalContext.Provider
      value={{
        globalValues: {},
        setGlobalValues: setGlobalCallbackFn,
      }}
    >
      <SearchPhase
        transitionCallback={callbackFn}
        token="TOKEN"
        type="ANIME"
      />
    </GlobalContext.Provider>,
  );
  const input = container.querySelector('input#search-input');
  return {
    callbackFn, container, setGlobalCallbackFn, input,
  };
};

describe('search phase tests', () => {
  beforeEach(() => {
    fetch.resetMocks();
    localStorage.clear();
  });
  it('updates the input field on typing', () => {
    const { input } = setup();
    act(() => {
      fireEvent.change(input, { target: { value: 'TEST' } });
    });
    expect(input.value).toBe('TEST');
  });

  it('does not load page progression slider on initial render', () => {
    const { container } = setup();
    expect(container.querySelector('#page-prog-container')).toBeNull();
  });

  describe('fetch mocking', () => {
    it('loads all page elements when good search sent', async () => {
      const { container, input } = setup();
      await act(async () => {
        fetch.mockResponseOnce(JSON.stringify(SEARCH_PHASE_MOCK_RESPONSE));
        fireEvent.change(input, { target: { value: 'TEST' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 13 });
      });
      expect(container.querySelector('#page-prog-container')).toBeDefined();
      expect(container.querySelectorAll('#results-item').length).toBe(4);
      const pageProgCircles = container.querySelectorAll('#page-prog-container .page-prog-circle');
      expect(pageProgCircles.length).toBe(2);
      expect(pageProgCircles[0]).toHaveClass('activePage');
    });

    it('refreshes on failed anilist response', async () => {
      jest.useFakeTimers();

      const { callbackFn, input } = setup();
      window.location.reload = jest.fn();
      await act(async () => {
        fetch.mockResponseOnce({ ok: false });
        fireEvent.change(input, { target: { value: 'TEST' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 13 });
      });
      expect(fetch.mock.calls.length).toBe(1);
      expect(callbackFn).not.toHaveBeenCalled();

      setTimeout(() => {
        expect(window.location.reload).toHaveBeenCalled();
      }, 2500);

      jest.runAllTimers();
    });

    it('refreshes on failed fetch', async () => {
      jest.useFakeTimers();

      const { callbackFn, input } = setup();
      window.location.reload = jest.fn();
      await act(async () => {
        fetch.mockReject(new Error('fake error'));
        fireEvent.change(input, { target: { value: 'TEST' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 13 });
      });
      expect(fetch.mock.calls.length).toBe(1);
      expect(callbackFn).not.toHaveBeenCalled();

      setTimeout(() => {
        expect(window.location.reload).toHaveBeenCalled();
      }, 2500);

      jest.runAllTimers();
    });

    it('shifts the page on arrow keypress', async () => {
      const { container, input } = setup();
      await act(async () => {
        fetch.mockResponse(JSON.stringify(SEARCH_PHASE_MOCK_RESPONSE));
        fireEvent.change(input, { target: { value: 'TEST' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 13 });
      });
      localStorage.removeItem('lastSearch'); // We have a rate limit of 2s per request -- avoid it in tests
      await act(async () => {
        fireEvent.keyDown(input, { key: 'ArrowRight', code: 39 });
      });
      const pageProgCircles = container.querySelectorAll('#page-prog-container .page-prog-circle');
      expect(pageProgCircles[1]).toHaveClass('activePage');
      expect(pageProgCircles[0]).toHaveClass('pastPage');
    });

    it('does not shift if at page 1', async () => {
      const { container, input } = setup();
      await act(async () => {
        fetch.mockResponse(JSON.stringify(SEARCH_PHASE_MOCK_RESPONSE));
        fireEvent.change(input, { target: { value: 'TEST' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 13 });
      });
      await act(async () => {
        fireEvent.keyDown(input, { key: 'ArrowLeft', code: 37 });
      });
      const pageProgCircles = container.querySelectorAll('#page-prog-container .page-prog-circle');
      expect(pageProgCircles[0]).toHaveClass('activePage');
      expect(pageProgCircles[1]).not.toHaveClass('activePage');
    });

    it('selects media 1 when F1 is pressed', async () => {
      const { callbackFn, input } = setup();
      await act(async () => {
        fetch.mockResponseOnce(JSON.stringify(SEARCH_PHASE_MOCK_RESPONSE));
        fireEvent.change(input, { target: { value: 'TEST' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 13 });
      });
      await act(async () => {
        fireEvent.keyDown(input, { key: 'F1', code: 112 });
      });
      const expectedParam = SEARCH_PHASE_MOCK_RESPONSE.data.Page.media[0];
      expect(callbackFn).toHaveBeenCalledWith(expectedParam);
    });

    it('selects media 2 when F2 is pressed', async () => {
      const { callbackFn, input } = setup();
      await act(async () => {
        fetch.mockResponseOnce(JSON.stringify(SEARCH_PHASE_MOCK_RESPONSE));
        fireEvent.change(input, { target: { value: 'TEST' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 13 });
      });
      await act(async () => {
        fireEvent.keyDown(input, { key: 'F2', code: 113 });
      });
      const expectedParam = SEARCH_PHASE_MOCK_RESPONSE.data.Page.media[1];
      expect(callbackFn).toHaveBeenCalledWith(expectedParam);
    });

    it('selects media 3 when F3 is pressed', async () => {
      const { callbackFn, input } = setup();
      await act(async () => {
        fetch.mockResponseOnce(JSON.stringify(SEARCH_PHASE_MOCK_RESPONSE));
        fireEvent.change(input, { target: { value: 'TEST' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 13 });
      });
      await act(async () => {
        fireEvent.keyDown(input, { key: 'F3', code: 114 });
      });
      const expectedParam = SEARCH_PHASE_MOCK_RESPONSE.data.Page.media[2];
      expect(callbackFn).toHaveBeenCalledWith(expectedParam);
    });

    it('selects media 4 when F4 is pressed', async () => {
      const { callbackFn, input } = setup();
      await act(async () => {
        fetch.mockResponseOnce(JSON.stringify(SEARCH_PHASE_MOCK_RESPONSE));
        fireEvent.change(input, { target: { value: 'TEST' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 13 });
      });
      await act(async () => {
        fireEvent.keyDown(input, { key: 'F4', code: 115 });
      });
      const expectedParam = SEARCH_PHASE_MOCK_RESPONSE.data.Page.media[3];
      expect(callbackFn).toHaveBeenCalledWith(expectedParam);
    });

    it('does nothing when selecting a media that is not present', async () => {
      const { callbackFn, input, container } = setup();
      await act(async () => {
        fetch.mockResponseOnce(JSON.stringify(SEARCH_PHASE_MOCK_RESPONSE_PARTIAL));
        fireEvent.change(input, { target: { value: 'TEST' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 13 });
      });
      expect(container.querySelectorAll('#results-item').length).toBe(1);
      await act(async () => {
        fireEvent.keyDown(input, { key: 'F2', code: 113 });
      });
      expect(callbackFn).not.toHaveBeenCalled();
    });

    it('doesnt fetch unnecessarily for cached views', async () => {
      // This also tests that our rate limiting does not apply to cached results (since we do not reset
      // the rate limit localStorage on the last query)

      const { input } = setup();
      expect(fetch.mock.calls.length).toBe(0);
      await act(async () => {
        fetch.mockResponse(JSON.stringify(SEARCH_PHASE_MOCK_RESPONSE));
        fireEvent.change(input, { target: { value: 'TEST' } });
      });
      await act(async () => {
        fireEvent.keyDown(input, { key: 'Enter', code: 13 });
      });
      localStorage.removeItem('lastSearch'); // We have a rate limit of 2s per request -- avoid it in tests
      expect(fetch.mock.calls.length).toBe(1);
      await act(async () => {
        fireEvent.keyDown(input, { key: 'ArrowRight', code: 39 });
      });
      // NOTE: We do not reset lastSearch here because it should not restrict requests to cached values.
      expect(fetch.mock.calls.length).toBe(2);
      await act(async () => {
        fireEvent.keyDown(input, { key: 'ArrowLeft', code: 37 });
      });
      expect(fetch.mock.calls.length).toBe(2);
    });

    it('stops requests if they are within the rate limit', async () => {
      jest.useFakeTimers();

      const { container, input } = setup();
      expect(fetch.mock.calls.length).toBe(0);
      await act(async () => {
        fetch.mockResponse(JSON.stringify(SEARCH_PHASE_MOCK_RESPONSE));
        fireEvent.change(input, { target: { value: 'TEST' } });
      });
      await act(async () => {
        fireEvent.keyDown(input, { key: 'Enter', code: 13 });
      });

      // NOTE: We do not reset the rate limit here, as part of the test
      expect(fetch.mock.calls.length).toBe(1);
      await act(async () => {
        fireEvent.keyDown(input, { key: 'ArrowRight', code: 39 });
      });
      expect(fetch.mock.calls.length).toBe(1);
      const pageProgCircles = container.querySelectorAll('#page-prog-container .page-prog-circle');
      expect(pageProgCircles[0]).toHaveClass('activePage');
      expect(pageProgCircles[1]).not.toHaveClass('activePage');

      act(() => jest.runAllTimers());
    });
  });
});
