import { createContext } from 'react';

interface AlertOptions {
  active?: boolean;
  content?: string;
  containerStyle?: Record<string, any>;
  style?: Record<string, any>;
  duration?: number;
}

interface GlobalValuesOptions {
  alertData?: AlertOptions;
}

export interface GlobalContextOptions {
  globalValues?: GlobalValuesOptions;
  setGlobalValues?: Function;
}

export default createContext({});
