import * as c from '../const';

it('has all values used in production', () => {
  const VARS_USED = [
    'VERIFICATION_QUERY',
    'ANILIST_BASE_URL',
    'POST_MEDIA_CHANGE_QUERY_GEN',
    'VIEWER_RELEVANT_MEDIA_QUERY_GEN',
    'MEDIA_STATUS_COLORS',
    'MEDIA_STATUS_ALERT_MESSAGES',
    'MEDIA_TYPE_SINGLETON_TERM',
    'SHOULD_SCORE_MEDIA_STATUS',
  ];
  VARS_USED.forEach((value) => {
    // console.log(value);
    expect(c[value]).toBeDefined();
  });
});

describe('query generators', () => {
  it('generates the POST query for media change', () => {
    const query = c.POST_MEDIA_CHANGE_QUERY_GEN({
      mediaId: 1, status: 'a', score: 1, progress: 1,
    });
    // Forgive this tabbing, it is necessary (unless there's a way to void tabspace in comparisons)
    const correctOutput = `mutation {
  SaveMediaListEntry(mediaId: 1, status: a, score: 1, progress: 1) {
    id
    status
    score
    progress
  }
}`;
    expect(query).toBe(correctOutput);
  });

  it('generates the viewer relevant media query', () => {
    const query = c.VIEWER_RELEVANT_MEDIA_QUERY_GEN(123123, 'ANIME');
    // Forgive this tabbing, it is necessary (unless there's a way to void tabspace in comparisons)
    const correctOutput = `query {
  MediaListCollection(userId: 123123, type: ANIME) {
    lists {
      name
      entries {
        mediaId
      }
    }
  }
}`;
    expect(query).toBe(correctOutput);
  });
});
