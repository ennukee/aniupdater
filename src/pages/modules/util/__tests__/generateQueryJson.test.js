import generateQueryJson from '../generateQueryJson';
import { VIEWER_RELEVANT_MEDIA_QUERY_GEN } from 'Utils/const';

// basically a snapshot test
it('outputs the correct query JS object', () => {
  const query = VIEWER_RELEVANT_MEDIA_QUERY_GEN(123123, 'ANIME');
  const jsobj = generateQueryJson(query, 'TOKEN_DUMMY');
  expect(jsobj).toStrictEqual({
    method: 'POST',
    headers: {
      Authorization: 'Bearer TOKEN_DUMMY',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query,
    }),
  });
});
