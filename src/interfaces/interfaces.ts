import { Dispatch } from 'react';

/* GENERIC */
export interface KeyPress {
  key: string;
}

/* const.js */
export interface PMCQGqueryProp {
  mediaId?: number | null;
  status?: string | null;
  score?: number | null;
  progress?: number | null;
}

/* TokenInput.tsx */
// Note for future specific response handling on status
// 400 = invalid query
// 401 = unauthorized
interface ResponseError {
  message?: string;
  status?: number;
  location?: Array<{ [key: string]: string }>;
}
export interface InitialQuery {
  data?: {
    Viewer?: {
      id: number;
      name: string;
      avatar?: {
        medium?: string;
      };
    };
  };
  errors?: ResponseError[];
}

/* SearchPhase.tsx */
export interface SearchResultParseExtra {
  direction?: number;
  page?: number;
}

interface CsrByMedia {
  [key: string]: {
    [key: string]: MediaEntry | number;
  };
}
export interface CachedSearchResults {
  ANIME?: CsrByMedia;
  MANGA?: CsrByMedia;
}

export interface MediaEntry {
  id: number;
  episodes?: number;
  chapters?: number;
  title: {
    userPreferred: string;
  };
  coverImage: {
    extraLarge?: string;
    color?: string | null;
  } | null;
  mediaListEntry: {
    progress?: number | null;
    score?: number | null;
  } | null;
}

export interface SearchResult {
  data?: {
    Page?: {
      pageInfo: {
        total: number;
      };
      media: MediaEntry[];
    };
  };
  errors?: ResponseError[];
}

/* Utils/useGlobalValues.ts */
interface AlertData {
  active?: boolean;
  content?: string;
  style?: Record<string, string>;
}

export interface GlobalValuesUpdate {
  type?: string;
  data?: AlertData;
}

export interface GlobalValueObject {
  alertData?: AlertData;
}

export interface GlobalValueContextObject {
  globalValues: GlobalValueObject;
  setGlobalValues: Dispatch<GlobalValuesUpdate>;
}

/* LoadingAnim.tsx */
export interface LoadingAnimScales {
  0: number;
  1: number;
  2: number;
}
