import { useState, useEffect } from 'react';

const useShiftModifier = () => {
  const [isShifting, setIsShifting] = useState(false);
  const handleKeyDown = (e) => {
    if (e.key === 'Shift') setIsShifting(true);
  };
  const handleKeyUp = (e) => {
    if (e.key === 'Shift') setIsShifting(false);
  };
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  });

  return { isShifting };
};

export default useShiftModifier;
