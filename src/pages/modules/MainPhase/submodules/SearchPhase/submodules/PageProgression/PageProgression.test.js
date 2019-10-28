import React from 'react';
import {
  render,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PageProgression from './PageProgression';

describe('page progression rendering', () => {
  it('does not render when there arent pages', () => {
    const { container } = render(
      <PageProgression
        maxPages={0}
        page={1}
      />,
    );
    expect(container.querySelector('#page-prog-container')).toBeNull();
  });

  it('renders when there are pages', () => {
    const { container } = render(
      <PageProgression
        maxPages={5}
        page={1}
      />,
    );
    expect(container.querySelector('#page-prog-container')).not.toBeNull();
  });
});

describe('page progression line tests', () => {
  it('fills the line based on current page', () => {
    const { container } = render(
      <PageProgression
        maxPages={5}
        page={3}
      />,
    );
    expect(container.querySelector('#line-fill')).toHaveStyle('width: 50%');
  });
});

describe('page progression circle tests', () => {
  it('has circles matching maxPages param', () => {
    const { container } = render(
      <PageProgression
        maxPages={5}
        page={1}
      />,
    );
    expect(container.querySelectorAll('.page-prog-circle').length).toBe(5);
  });

  it('highlights active page circle', () => {
    const { container } = render(
      <PageProgression
        maxPages={5}
        page={2}
      />,
    );
    expect(container.querySelectorAll('.page-prog-circle')[1]).toHaveClass('activePage');
  });

  it('colors previous page circles', () => {
    const { container } = render(
      <PageProgression
        maxPages={5}
        page={3}
      />,
    );
    expect(container.querySelectorAll('.page-prog-circle')[0]).toHaveClass('pastPage');
    expect(container.querySelectorAll('.page-prog-circle')[1]).toHaveClass('pastPage');
  });
});
