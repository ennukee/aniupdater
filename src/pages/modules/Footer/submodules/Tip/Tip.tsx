import React, { useEffect, useState } from 'react';
import { IoIosGitPullRequest, IoIosHappy, IoIosFlask, IoIosHeartEmpty } from 'react-icons/io';
import './Tip.scss';

/* eslint-disable react/jsx-key */
//   For some reason, adding a key to these divs cause tests to fail
//   but it still works fine in development environment. Since this isn't
//   a normal use case for an array of elements, it should be OK to disable.
const tips = [
  <div>
    <IoIosHappy size="1.75em" />
    Did you know you can do&nbsp;
    <strong>Shift + CapsLock</strong>
    &nbsp;to return to the start?
  </div>,
  <div>
    <IoIosGitPullRequest size="1.75em" />
    Want a new feature fast? Make a ticket or develop it yourself! Check the GitHub.
  </div>,
  <div>
    <IoIosFlask size="1.75em" />
    Is a new anime or manga missing? Try&nbsp;
    <strong>Ctrl + Delete</strong>
    &nbsp;to wipe the saved data
  </div>,
  <div>
    <IoIosHeartEmpty size="1.75em" />
    Looking for a new anime to watch? I recommend the&nbsp;
    <strong>Utawarerumono</strong>
    &nbsp;series!
  </div>,
];
/* eslint-enable react/jsx-key */

const Tip = (): React.ReactElement => {
  const [tipCount, setTipCount] = useState(0);
  useEffect(() => {
    const intrvl = setInterval(() => {
      setTipCount(tC => tC + 1);
    }, 10000);
    return (): void => clearInterval(intrvl);
  }, []);
  return <>{tips[tipCount % tips.length]}</>;
};

export default Tip;
