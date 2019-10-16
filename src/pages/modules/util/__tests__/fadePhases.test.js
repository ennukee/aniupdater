import fadePhases from '../fadePhases';


describe('fadePhases', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div>
        <div id="t1" class="active"></div>
        <div id="t2" class="inactive"></div>
      </div>
    `;
    window.t1Elem = document.getElementById('t1');
    window.t2Elem = document.getElementById('t2');
  });
  it('switches the classes on two elements', () => {
    return fadePhases(window.t1Elem, window.t2Elem, 100).then(() => {
      expect(window.t1Elem.classList[0]).toBe('inactive');
      expect(window.t1Elem.classList.length).toBe(1); // no duplicate classes
      expect(window.t2Elem.classList[0]).toBe('active');
      expect(window.t2Elem.classList.length).toBe(1);
    });
  });
  it('calls replace the correct number of times with right params', () => {
    window.t1Elem.classList.replace = jest.fn();
    window.t2Elem.classList.replace = jest.fn();
    return fadePhases(window.t1Elem, window.t2Elem, 100).then(() => {
      expect(window.t1Elem.classList.replace).toHaveBeenNthCalledWith(1, 'active', 'leaving');
      expect(window.t1Elem.classList.replace).toHaveBeenNthCalledWith(2, 'leaving', 'inactive');
      expect(window.t2Elem.classList.replace).toHaveBeenNthCalledWith(1, 'inactive', 'preenter');
      expect(window.t2Elem.classList.replace).toHaveBeenNthCalledWith(2, 'preenter', 'active');
    });
  });
});
