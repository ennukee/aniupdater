import React from 'react';
import './PageProgression.scss';

const PageProgression = ({ maxPages = 0, page = 0 }): React.ReactElement =>
  maxPages <= 1 ? (
    <></>
  ) : (
    <div id="page-prog-container">
      <div id="line-container">
        <div id="line">
          <div
            id="line-fill"
            style={{
              width: `${Math.floor(((page - 1) / Math.max(maxPages - 1, 1)) * 100)}%`,
            }}
          />
        </div>
      </div>
      <div id="circles">
        {Object.keys([...Array(maxPages)]).map((v, i) => (
          <div
            key={`circle${v}`}
            className={`
              page-prog-circle 
              ${i + 1 < page ? 'pastPage' : ''}
              ${i + 1 === page ? 'activePage' : ''}
            `}
          />
        ))}
      </div>
    </div>
  );

export default PageProgression;
