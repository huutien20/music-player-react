import axios from 'axios';
import { forwardRef, useCallback, useContext, useEffect, useState } from 'react';
import { AppContext } from '~/AppContext/AppContext';

const Audio = forwardRef((props, ref) => {
    console.log('audio');

    const context = useContext(AppContext);
    const { isPlaying, isRandom, songList, currentSong, isRepeat, setIsPlaying, setCurrentSong, setProgressPercent } =
        context;

    // const [urlAudio, setUrlAudio] = useState();

    // console.log(urlAudio);
    // useEffect(() => {
    //     ref.current.play();
    // }, [urlAudio, ref]);

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
            // if (e.keyCode === 32) {
            //     e.preventDefault();
            //     setIsPlaying(!isPlaying);
            //     if (isPlaying) {
            //         audio.pause();
            //     } else {
            //         audio.play();
            //     }
            // }
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
            // onError={() => {
            //     setIsPlaying(false);
            //     axios
            //         .get(`https://api-zingmp3-vercel.vercel.app/api/song`, {
            //             params: {
            //                 id: currentSong.id,
            //             },
            //         })
            //         .then((res) => {
            //             const data = res.data.data;
            //             if (data) {
            //                 setUrlAudio(data[128]);
            //                 setCurrentSong({ ...currentSong, url: data[128] });
            //             }
            //         });
            // }}
            // onCanPlayThrough={() => setIsPlaying(true)}
        ></audio>
    );
});

export default Audio;
