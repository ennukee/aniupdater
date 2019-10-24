import React from 'react';
import {
  render,
  fireEvent,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import fetch from 'jest-fetch-mock';
import DataForm from '../DataForm';
import { MEDIA_STATUS_COLORS, ANILIST_BASE_URL } from '../../../util/const';
import GlobalContext from '../../../util/GlobalContext';

const setup = ({ presetProgress = 0, presetScore = 0 } = {}) => {
  const callbackFn = jest.fn();
  const setGlobalCallbackFn = jest.fn();
  const { container } = render(
    <GlobalContext.Provider
      value={{
        globalValues: {},
        setGlobalValues: setGlobalCallbackFn,
      }}
    >
      <DataForm
        title="AX"
        image="2020"
        color="#eee"
        type="ANIME"
        token="TOKEN"
        mediaId={123123}
        transitionCallback={callbackFn}
        presetProgress={presetProgress}
        presetScore={presetScore}
      />
    </GlobalContext.Provider>,
  );
  return { callbackFn, container, setGlobalCallbackFn };
};

describe('data phase tests', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('focuses the count field on page load', () => {
    const { container } = setup();
    expect(container.querySelector('#data-form-media-count-value')).toHaveFocus();
  });
  it('stylizes the cover image div correctly', () => {
    const { container } = setup();
    const imageDiv = container.querySelector('#data-form-image');
    // TODO: Uncomment next line when bg image is used
    // expect(imageDiv).toHaveStyle("background-image: url('2020')");
    expect(imageDiv).toHaveStyle(`border: 1px solid ${MEDIA_STATUS_COLORS.CURRENT}`); // default border
  });
  it('autopopulates media count field', () => {
    const { container } = setup({ presetProgress: 12 });
    expect(container.querySelector('#data-form-media-count-value')).toHaveValue(12);
  });
  it('changes to completed mode, calls global context and renders', () => {
    const { container, setGlobalCallbackFn } = setup({ presetScore: 5 });
    fireEvent.keyDown(container, { key: 'c', code: 67 });

    const imageDiv = container.querySelector('#data-form-image');
    const scoreField = container.querySelector('#data-form-score-value');
    expect(setGlobalCallbackFn).toHaveBeenCalledWith({
      type: 'ALERT',
      data: {
        active: true,
        content: 'Now completing...',
        style: {
          backgroundColor: `${MEDIA_STATUS_COLORS.COMPLETED}3`,
          border: `1px solid ${MEDIA_STATUS_COLORS.COMPLETED}`,
        },
      },
    });
    expect(imageDiv).toHaveStyle(`border: 1px solid ${MEDIA_STATUS_COLORS.COMPLETED}`);
    expect(scoreField).not.toBeNull();
    expect(scoreField).toHaveValue(5);
  });
  it('changes to dropped mode and renders', () => {
    const { container } = setup();
    fireEvent.keyDown(container, { key: 'd', code: 68 });

    const imageDiv = container.querySelector('#data-form-image');
    const scoreField = container.querySelector('#data-form-score-value');
    expect(imageDiv).toHaveStyle(`border: 1px solid ${MEDIA_STATUS_COLORS.DROPPED}`);
    expect(scoreField).not.toBeNull();
  });
  it('changes to paused/hold mode and renders', () => {
    const { container } = setup();
    fireEvent.keyDown(container, { key: 'h', code: 72 });

    const imageDiv = container.querySelector('#data-form-image');
    const scoreField = container.querySelector('#data-form-score-value');
    expect(imageDiv).toHaveStyle(`border: 1px solid ${MEDIA_STATUS_COLORS.PAUSED}`);
    expect(scoreField).not.toBeNull();
  });

  it('posts data to anilist on Enter', async () => {
    fetch.mockResponseOnce(JSON.stringify({ ok: true }));
    const { container, callbackFn } = setup({ presetProgress: 12 });
    await act(async () => {
      fireEvent.keyDown(container, { key: 'Enter', code: 13 });
    });
    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toBe(ANILIST_BASE_URL);
    expect(callbackFn).toHaveBeenCalledTimes(1);
  });

  it('fails and refreshes on invalid token issues', async () => {
    jest.useFakeTimers();

    fetch.mockResponseOnce(JSON.stringify({ ok: false }));
    window.location.reload = jest.fn();
    const { container, callbackFn } = setup({ presetProgress: 12 });
    await act(async () => {
      fireEvent.keyDown(container, { key: 'Enter', code: 13 });
    });
    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toBe(ANILIST_BASE_URL);
    expect(callbackFn).not.toHaveBeenCalled();

    setTimeout(() => {
      expect(window.location.reload).toHaveBeenCalled();
    }, 2500);

    jest.runAllTimers();
  });

  it('reacts correctly on failed fetch', async () => {
    jest.useFakeTimers();

    fetch.mockReject(new Error('fake error'));
    window.location.reload = jest.fn();
    const { container, callbackFn } = setup({ presetProgress: 12 });
    await act(async () => {
      fireEvent.keyDown(container, { key: 'Enter', code: 13 });
    });
    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toBe(ANILIST_BASE_URL);
    expect(callbackFn).not.toHaveBeenCalled();

    setTimeout(() => {
      expect(window.location.reload).toHaveBeenCalled();
    }, 2500);

    jest.runAllTimers();
  });
});
