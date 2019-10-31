import React from 'react';
import {
  render,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Logo from './Logo';

describe('logo tests', () => {
  it('is large and centralized in initial form', () => {
    const { container } = render(<Logo mainState="normal" />);
    const logoDiv = container.querySelector('#aniupdater-logo');
    expect(logoDiv).toHaveStyle('width: 360px');
    expect(logoDiv).toHaveStyle('height: 90px');
    expect(logoDiv).toHaveStyle('left: 50%');
    expect(logoDiv).toHaveStyle('top: 50px');
    // expect(logoDiv).toHaveStyle('transform: translateX(-50%)');
  });

  it('is small and in corner when login is done', () => {
    const { container } = render(<Logo mainState="entering" />);
    const logoDiv = container.querySelector('#aniupdater-logo');
    expect(logoDiv).toHaveStyle('width: 150px');
    expect(logoDiv).toHaveStyle('height: 50px');
    expect(logoDiv).toHaveStyle('left: 0%');
    expect(logoDiv).toHaveStyle('top: 0px');
    // expect(logoDiv).toHaveStyle('transform: translateX(0%)');
  });
});
