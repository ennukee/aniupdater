import searchQueryBase from 'Utils/searchQueryBase';

it('generates the correct search query', () => {
  const query = searchQueryBase(1, 'Kimi', 'ANIME');
  expect(query).toBe(`query {
    Page(page: 1, perPage: 4) {
      pageInfo {
        total
      }
      media(search: "Kimi", type: ANIME) {
        id
        episodes
        chapters
        title {
          userPreferred
        }
        coverImage {
          extraLarge
          color
        }
        mediaListEntry {
          progress
          score
        }
      }
    }
  }`);
});
