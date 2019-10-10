export const VERIFICATION_QUERY = `query {
  Viewer {
    id
    name
  }
}`;
export const ANILIST_BASE_URL = 'https://graphql.anilist.co';
export const NO_RESULTS_FOUND_RESPONSE = [
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
export const POST_MEDIA_CHANGE_QUERY_GEN = (params) => `mutation {
  SaveMediaListEntry(${Object.entries(params).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(', ')}) {
    id
    status
    score,
    progress
  }
}`;
export const VIEWER_RELEVANT_MEDIA_QUERY_GEN = (userId, type) => `query {
  MediaListCollection(userId: ${userId}, type: ${type}) {
   lists {
     name
     entries {
       mediaId
     }
   }
 }
}`;
export const MEDIA_STATUS_COLORS = {
  CURRENT: '#6c6',
  COMPLETED: '#66c',
  DROPPED: '#c66',
  PAUSED: '#fb6',
};
export const MEDIA_STATUS_ALERT_MESSAGES = {
  CURRENT: 'Now updating existing...',
  COMPLETED: 'Now completing...',
  DROPPED: 'Now dropping...',
  PAUSED: 'Now pausing...',
}
export const MEDIA_TYPE_SINGLETON_TERM = {
  ANIME: 'Episode',
  MANGA: 'Chapter',
};
export const SHOULD_SCORE_MEDIA_STATUS = {
  COMPLETED: true,
  DROPPED: true,
  HOLD: true,
};
