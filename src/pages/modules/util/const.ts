import { PMCQGqueryProp } from 'interfaces/interfaces';

export const LOCAL_RATE_LIMIT = 2000; // 2 seconds;
export const VERIFICATION_QUERY = `query {
  Viewer {
    id
    name
    avatar {
      medium
    }
  }
}`;
export const ANILIST_BASE_URL = 'https://graphql.anilist.co';
export const NO_RESULTS_FOUND_RESPONSE = [];
export const NO_RESULTS_FOUND_RESPONSE__NO_USE = [
  {
    id: 3,
    title: {
      userPreferred: '---',
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
export const FOCUS_ELEMENT_BY_PHASE = {
  'search-phase': 'search-input',
};

export const POST_MEDIA_CHANGE_QUERY_GEN = (params: PMCQGqueryProp): string => `mutation {
  SaveMediaListEntry(${Object.entries(params)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ')}) {
    id
    status
    score
    progress
  }
}`;
export const VIEWER_RELEVANT_MEDIA_QUERY_GEN = (userId: number, type: string): string => `query {
  MediaListCollection(userId: ${userId}, type: ${type}) {
    lists {
      name
      entries {
        mediaId
      }
    }
  }
}`;

export const MEDIA_STATUS_COLORS: { [key: string]: string } = {
  CURRENT: '#6c6',
  COMPLETED: '#66c',
  DROPPED: '#c66',
  PAUSED: '#fb6',
};
export const MEDIA_STATUS_ALERT_MESSAGES: { [key: string]: string } = {
  CURRENT: 'Now updating existing...',
  COMPLETED: 'Now completing...',
  DROPPED: 'Now dropping...',
  PAUSED: 'Now pausing...',
};
export const MEDIA_TYPE_SINGLETON_TERM: { [key: string]: string } = {
  ANIME: 'Episode',
  MANGA: 'Chapter',
};
export const SHOULD_SCORE_MEDIA_STATUS: { [key: string]: boolean } = {
  COMPLETED: true,
  DROPPED: true,
  PAUSED: true,
};
export const SEARCH_PHASE_MOCK_RESPONSE = {
  data: {
    Page: {
      pageInfo: {
        total: 5,
      },
      media: [
        {
          id: 123,
          title: {
            userPreferred: 'AYAYA',
          },
          coverImage: {
            large: '',
            color: '#111',
          },
          mediaListEntry: {
            progress: 1,
            score: 1,
          },
        },
        {
          id: 124,
          title: {
            userPreferred: 'DansGame',
          },
          coverImage: {
            large: '',
            color: '#222',
          },
          mediaListEntry: {
            progress: 2,
            score: 2,
          },
        },
        {
          id: 125,
          title: {
            userPreferred: 'Kappa',
          },
          coverImage: {
            large: '',
            color: '#333',
          },
          mediaListEntry: {
            progress: 3,
            score: 3,
          },
        },
        {
          id: 126,
          title: {
            userPreferred: 'PogU',
          },
          coverImage: {
            large: '',
            color: '#444',
          },
          mediaListEntry: {
            progress: 4,
            score: 4,
          },
        },
      ],
    },
  },
};
export const SEARCH_PHASE_MOCK_RESPONSE_PARTIAL = {
  data: {
    Page: {
      pageInfo: {
        total: 5,
      },
      media: [
        {
          id: 123,
          title: {
            userPreferred: 'AYAYA',
          },
          coverImage: {
            large: '',
            color: '#111',
          },
          mediaListEntry: {
            progress: 1,
            score: 1,
          },
        },
      ],
    },
  },
};
