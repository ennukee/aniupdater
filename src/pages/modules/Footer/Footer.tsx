import React from 'react';
import Tip from './submodules/Tip/Tip';
import './Footer.scss';

const Footer = (): React.ReactElement => (
  <footer>
    <div id="footer-container">
      <nav aria-label="Social media links">
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
      </nav>
    </div>

    <div id="tip-container">
      <Tip />
    </div>
  </footer>
);

export default Footer;
