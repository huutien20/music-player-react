import { createContext, useState } from 'react';

const AppContext = createContext();

const ProgressContext = createContext();

const AppProvider = ({ children }) => {
    const [songList, setSongList] = useState([]);
    const [currentSong, setCurrentSong] = useState({});
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);
    const [isRandom, setIsRandom] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    return (
        <AppContext.Provider
            value={{
                songList,
                currentSong,
                isPlaying,
                isRepeat,
                isRandom,
                isFavorite,
                setSongList,
                setCurrentSong,
                setIsPlaying,
                setIsRepeat,
                setIsRandom,
                setIsFavorite,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

const ProgressProvider = ({ children }) => {
    const [progressPercent, setProgressPercent] = useState(0);

    return (
        <ProgressContext.Provider value={{ progressPercent, setProgressPercent }}>{children}</ProgressContext.Provider>
    );
};

export { AppContext, ProgressContext, AppProvider, ProgressProvider };
