import React from 'react';
import ReactTooltip from 'react-tooltip';
import './Footer.css';

const Footer = () => (
  <>
    <div id="footer-container">
      <ReactTooltip />
      <a className="footer-logo github" href="https://github.com/ennukee/aniupdater">
        <img
          alt="github logo"
          className="footer-logo github"
          id="github-logo"
          src={`${process.env.PUBLIC_URL}/logos/github.png`}
        />
      </a>
      <a className="footer-logo" href="https://www.twitter.com/ennukee">
        <img
          alt="twitter logo"
          className="footer-logo"
          id="twitter-logo"
          src={`${process.env.PUBLIC_URL}/logos/twitter.svg`}
        />
      </a>
      <img
        alt="discord logo"
        className="footer-logo"
        id="discord-logo"
        data-tip="enragednuke#0001"
        src={`${process.env.PUBLIC_URL}/logos/discord.svg`}
      />
    </div>
  </>
);

export default Footer;
