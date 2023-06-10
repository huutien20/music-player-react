import { createContext, useState } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
    const [songList, setSongList] = useState([]);
    const [currentSong, setCurrentSong] = useState({});
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);
    const [isRandom, setIsRandom] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [progressPercent, setProgressPercent] = useState(0);

    return (
        <AppContext.Provider
            value={{
                songList,
                currentSong,
                isPlaying,
                isRepeat,
                isRandom,
                isFavorite,
                progressPercent,
                setSongList,
                setCurrentSong,
                setIsPlaying,
                setIsRepeat,
                setIsRandom,
                setIsFavorite,
                setProgressPercent,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}
