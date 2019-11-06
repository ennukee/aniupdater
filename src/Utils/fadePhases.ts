import timeout from 'Utils/timeout';

// Begin the manual transition animations (where's GSAP at tho)
export default async (curPhaseElem: HTMLElement, nextPhaseElem: HTMLElement, duration: number): Promise<void> => {
  curPhaseElem.classList.replace('active', 'leaving');
  await timeout(duration - 10);
  curPhaseElem.classList.replace('leaving', 'inactive');
  nextPhaseElem.classList.replace('inactive', 'preenter');
  await timeout(10);
  nextPhaseElem.classList.replace('preenter', 'active');
};
