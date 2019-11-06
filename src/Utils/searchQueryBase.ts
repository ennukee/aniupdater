export default (newPage: number, search: string, type: string): string => `query {
    Page(page: ${newPage}, perPage: 4) {
      pageInfo {
        total
      }
      media(search: "${search}", type: ${type}) {
        id
        episodes
        chapters
        title {
          userPreferred
        }
        coverImage {
          large
          color
        }
        mediaListEntry {
          progress
          score
        }
      }
    }
  }`;
