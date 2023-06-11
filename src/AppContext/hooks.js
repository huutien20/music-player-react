import { useContext } from 'react';
import { AppContext, ProgressContext } from './AppContext';

export const useAppContext = () => {
    const state = useContext(AppContext);
    return { ...state };
};

export const useProgressContext = () => {
    const state = useContext(ProgressContext);
    return { ...state };
};
