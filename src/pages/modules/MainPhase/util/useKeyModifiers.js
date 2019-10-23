import { useState, useEffect } from 'react';

const useKeyModifiers = () => {
  const [isShifting, setIsShifting] = useState(false);
  const [isCtrling, setIsCtrling] = useState(false);
  const handleKeyDown = (e) => {
    if (e.key === 'Shift') setIsShifting(true);
    if (e.key === 'Control') setIsCtrling(true);
  };
  const handleKeyUp = (e) => {
    if (e.key === 'Shift') setIsShifting(false);
    if (e.key === 'Control') setIsCtrling(false);
  };
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  });

  return { isShifting, isCtrling };
};

export default useKeyModifiers;
