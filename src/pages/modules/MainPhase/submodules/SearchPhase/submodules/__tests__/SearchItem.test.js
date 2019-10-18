import React from 'react';
import {
  render,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SearchItem from '../SearchItem';

describe('search item DOM tests', () => {
  describe('both views', () => {
    // When the backgroundImage is uncommented in SearchItem, unskip this
    it.skip('loads the coverImage', () => {
      const imgUrl = 'http://a.ya/ya.png';
      const { container } = render(
        <SearchItem
          color="#eee"
          title="AYAYA"
          index={2}
          coverImage={imgUrl}
          isFlatView
        />,
      );
      expect(container.querySelector('#results-item .img')).toHaveStyle(`background-image: url('${imgUrl}')`);
    });
    it('loads the title', () => {
      const { container } = render(
        <SearchItem
          color="#eee"
          title="AYAYA"
          index={2}
          coverImage=""
          isFlatView
        />,
      );
      expect(container.querySelector('.result-item-title')).toHaveTextContent('AYAYA');
    });
  });
  describe('flat view', () => {
    it('has correct sizing styles on container', () => {
      const { container } = render(
        <SearchItem
          color="#eee"
          title="AYAYA"
          index={2}
          coverImage=""
          isFlatView
        />,
      );
      expect(container.querySelector('#results-item')).toHaveStyle('top: 50%');
      expect(container.querySelector('#results-item')).toHaveStyle('left: 0%');
      expect(container.querySelector('#results-item')).toHaveStyle('width: 50%');
      expect(container.querySelector('#results-item')).toHaveStyle('height: 50%');
    });
    it('has the right view div id', () => {
      const { container } = render(
        <SearchItem
          color="#eee"
          title="AYAYA"
          index={2}
          coverImage=""
          isFlatView
        />,
      );
      expect(container.querySelector('#result-item-title-flat-view')).not.toBeNull();
      expect(container.querySelector('#result-item-title-grid-view')).toBeNull();
    });
  });
  describe('grid view', () => {
    it('has correct sizing styles on container', () => {
      const { container } = render(
        <SearchItem
          color="#eee"
          title="AYAYA"
          index={2}
          coverImage=""
          isFlatView={false}
        />,
      );
      expect(container.querySelector('#results-item')).toHaveStyle('top: 0%');
      expect(container.querySelector('#results-item')).toHaveStyle('left: 50%');
      expect(container.querySelector('#results-item')).toHaveStyle('width: 25%');
      expect(container.querySelector('#results-item')).toHaveStyle('height: 100%');
    });
    it('has the right view div id', () => {
      const { container } = render(
        <SearchItem
          color="#eee"
          title="AYAYA"
          index={2}
          coverImage=""
          isFlatView={false}
        />,
      );
      expect(container.querySelector('#result-item-title-flat-view')).toBeNull();
      expect(container.querySelector('#result-item-title-grid-view')).not.toBeNull();
    });
  });
});
