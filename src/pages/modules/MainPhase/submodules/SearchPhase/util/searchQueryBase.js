export default (newPage, search, type) => `query {
    Page(page: ${newPage}, perPage: 4) {
      pageInfo {
        total
      }
      media(search: "${search}", type: ${type}) {
        id
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
