/* GENERIC */
export interface KeyPress {
  key: string;
}

/* const.js */
export interface PMCQGqueryProp {
  mediaId?: number | undefined;
  status?: string | undefined;
  score?: number | undefined;
  progress?: number | undefined;
}

/* Below serve -some- file */

interface MediaListEntry {
  progress?: number;
  score?: number;
}

interface CoverImage {
  large?: string;
  color?: string;
}

interface Title {
  userPreferred?: string;
}

export interface SelectedMedia {
  id?: number;
  title: Title;
  coverImage: CoverImage;
  mediaListEntry?: MediaListEntry | undefined;
  episodes?: number;
  chapters?: number;
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
  errors?: Array<ResponseError>;
}

/* LoadingAnim.tsx */
export interface LoadingAnimScales {
  0: number;
  1: number;
  2: number;
}
