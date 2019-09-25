export const VERIFICATION_QUERY = `query {
  Media(id: 1) {
    title {
    english
    }
  }
}`;
export const ANILIST_BASE_URL = 'https://graphql.anilist.co';
export const NO_RESULTS_FOUND_RESPONSE = [
  {
    id: 3,
    title: {
      userPreferred: 'S-senpai!',
    },
    coverImage: {
      large: '',
      color: '#e44',
    },
  },
  {
    id: 0,
    title: {
      userPreferred: "I'm sorry!",
    },
    coverImage: {
      large: '',
      color: '#e44',
    },
  },
  {
    id: 1,
    title: {
      userPreferred: 'No results were found!',
    },
    coverImage: {
      large: '',
      color: '#e44',
    },
  },
  {
    id: 2,
    title: {
      userPreferred: 'Please try another one!',
    },
    coverImage: {
      large: '',
      color: '#e44',
    },
  },
];
