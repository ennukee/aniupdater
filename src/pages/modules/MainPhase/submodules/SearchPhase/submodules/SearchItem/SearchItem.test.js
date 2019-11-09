import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SearchItem from './SearchItem.tsx';

describe('search item DOM tests', () => {
  describe('both views', () => {
    // TODO: When the backgroundImage is uncommented in SearchItem, unskip this
    it.skip('loads the coverImage', () => {
      const imgUrl = 'http://a.ya/ya.png';
      const { container } = render(<SearchItem color="#eee" title="AYAYA" index={2} coverImage={imgUrl} isFlatView />);
      expect(container.querySelector('#results-item .img')).toHaveStyle(`background-image: url('${imgUrl}')`);
    });
    it('loads the title', () => {
      const { container } = render(<SearchItem color="#eee" title="AYAYA" index={2} coverImage="" isFlatView />);
      expect(container.querySelector('.result-item-title')).toHaveTextContent('AYAYA');
    });
    it('loads the progress when it exists', () => {
      const { container } = render(
        <SearchItem color="#eee" title="AYAYA" index={2} progress={23} maxProgress={24} coverImage="" isFlatView />,
      );
      expect(container.querySelector('#result-item-media-progress')).toBeDefined();
      expect(container.querySelector('#result-item-media-progress')).toHaveTextContent('23 / 24');
    });
    it('does not load the progress when it is absent', () => {
      const { container } = render(
        <SearchItem color="#eee" title="AYAYA" index={2} progress={null} maxProgress={24} coverImage="" isFlatView />,
      );
      expect(container.querySelector('#result-item-media-progress')).toBeNull();
    });
  });
  describe('grid view', () => {
    it('has correct sizing styles on container', () => {
      const { container } = render(
        <SearchItem color="#eee" title="AYAYA" index={2} coverImage="" isFlatView={false} />,
      );
      expect(container.querySelector('#results-item')).toHaveStyle('top: 0px');
      expect(container.querySelector('#results-item')).toHaveStyle('left: 50%');
      expect(container.querySelector('#results-item')).toHaveStyle('width: 25%');
      expect(container.querySelector('#results-item')).toHaveStyle('height: 100%');
    });
    it('has the right view div id', () => {
      const { container } = render(
        <SearchItem color="#eee" title="AYAYA" index={2} coverImage="" isFlatView={false} />,
      );
      expect(container.querySelector('#result-item-title-flat-view')).toBeNull();
      expect(container.querySelector('#result-item-title-grid-view')).not.toBeNull();
    });
  });
});
