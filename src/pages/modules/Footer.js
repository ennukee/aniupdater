import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <>
      <div id="footer-container">
        Developed with&nbsp;
        <span role="img" aria-label="love">❤️</span>
        &nbsp;by&nbsp;
        <a href="https://www.twitter.com/ennukee">@ennukee</a>
        &nbsp;/&nbsp;
        <img alt="discord logo" className="discord" id="discord-logo" src={`${process.env.PUBLIC_URL}/discord.svg`} />
        <span className="discord" id="discord-label">enragednuke#0001</span>
      </div>
    </>
  );
};

export default Footer;

// Code to be potentially used if I ever implement a locale system down the line
/* <div id="locale-selector-container">
        <span
          role="button"
          tabIndex={-1}
          className="locale-selector"
          id="en"
          data-value="EN"
          onClick={selectLocale}
          onKeyDown={selectLocale}
        >
          English
        </span>
        &nbsp;
        <span
          role="button"
          tabIndex={-1}
          className="locale-selector"
          id="jp"
          data-value="JP"
          onClick={selectLocale}
          onKeyDown={selectLocale}
        >
          English
        </span>
      </div> */
