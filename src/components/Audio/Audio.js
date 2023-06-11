import { forwardRef, useCallback, useEffect } from 'react';
import { useAppContext, useProgressContext } from '~/AppContext/hooks';

const Audio = forwardRef((props, ref) => {
    const { isPlaying, isRandom, songList, currentSong, isRepeat, setIsPlaying, setCurrentSong } = useAppContext();
    const { setProgressPercent } = useProgressContext();

    useEffect(() => {
        const audio = ref.current;

        if (isPlaying) {
            audio.play();
        } else {
            audio.pause();
        }
    }, [currentSong, isPlaying, ref]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const audio = ref.current;

            if (e.keyCode === 39) {
                audio.currentTime += 5;
            }
            if (e.keyCode === 37) {
                audio.currentTime -= 5;
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isPlaying, setIsPlaying, ref]);

    const handleNextSong = useCallback(() => {
        if (isRandom) {
            let indexRandom;
            do {
                indexRandom = Math.floor(Math.random() * songList.length);
            } while (indexRandom === currentSong.index);
            setCurrentSong(songList[indexRandom]);
        } else {
            if (currentSong.index !== songList.length - 1) {
                setCurrentSong(songList[currentSong.index + 1]);
            } else {
                setCurrentSong(songList[0]);
            }
        }
    }, [isRandom, currentSong.index, songList, setCurrentSong]);

    return (
        <audio
            ref={ref}
            src={currentSong.url}
            onTimeUpdate={(e) => {
                const audio = e.target;
                if (audio.duration && isPlaying) {
                    const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
                    setProgressPercent(progressPercent);
                }
            }}
            onEnded={() => {
                if (isRepeat) {
                    setProgressPercent(0);
                    ref.current.play();
                } else handleNextSong();
            }}
        ></audio>
    );
});

export default Audio;
