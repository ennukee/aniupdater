import React, { useEffect, useState } from 'react';
import {
  IoIosGitPullRequest, IoIosHappy, IoIosFlask, IoIosHeartEmpty,
} from 'react-icons/io';
import './Tip.css';

const tips = [
  (
    <div>
      <IoIosHappy size="1.75em" />
      Did you know you can do&nbsp;
      <strong>Shift + CapsLock</strong>
      &nbsp;to return to the start?
    </div>
  ),
  (
    <div>
      <IoIosGitPullRequest size="1.75em" />
      Want a new feature fast? Make a ticket or develop it yourself! Check the GitHub.
    </div>
  ),
  (
    <div>
      <IoIosFlask size="1.75em" />
      Is a new anime or manga missing? Try&nbsp;
      <strong>Ctrl + Delete</strong>
      &nbsp;to wipe the saved data
    </div>
  ),
  (
    <div>
      <IoIosHeartEmpty size="1.75em" />
      Looking for a new anime to watch? I recommend the&nbsp;
      <strong>Utawarerumono</strong>
      &nbsp;series!
    </div>
  ),
];

const Tip = () => {
  const [tipCount, setTipCount] = useState(0);
  useEffect(() => {
    const intrvl = setInterval(() => {
      setTipCount((tC) => tC + 1);
    }, 10000);
    return () => clearInterval(intrvl);
  }, []);
  return (
    <>
      {tips[tipCount % tips.length]}
    </>
  );
};

export default Tip;
