import useHelpMap from '../useHelpMap';

// this is a test boi get outta here hooklint
// eslint-disable-next-line react-hooks/rules-of-hooks
const { helpByPhase: helpMap } = useHelpMap();

describe('contains all the valid phases', () => {
  it('contains media type selection phase', () => {
    expect(helpMap['a-or-m-phase']).toBeDefined();
  });
  it('contains search phase', () => {
    expect(helpMap['search-phase']).toBeDefined();
  });
  it('contains data form phase', () => {
    expect(helpMap['data-phase']).toBeDefined();
  });
});
