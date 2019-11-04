import { createContext } from 'react';

interface AlertOptions {
    active?: boolean;
    content?: string;
    containerStyle?: Object;
    style?: Object;
    duration?: number;
}

interface GlobalValuesOptions {
    alertData?: AlertOptions,
}

export interface GlobalContextOptions {
    globalValues?: GlobalValuesOptions;
    setGlobalValues?: Function;
}

export default createContext({});
