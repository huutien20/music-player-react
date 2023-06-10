import classNames from 'classnames/bind';
import styles from './Control.module.scss';
import { FaPause, FaPlay, FaRandom, FaStepBackward, FaStepForward, FaUndo } from 'react-icons/fa';
import { memo, useCallback, useContext } from 'react';
import { AppContext } from '~/AppContext/AppContext';

const cx = classNames.bind(styles);

function Control({ hideRandom, hideRepeat, hidePrev, hideNext }) {
    const context = useContext(AppContext);
    const {
        isPlaying,
        isRandom,
        isRepeat,
        currentSong,
        songList,
        setIsPlaying,
        setIsRandom,
        setIsRepeat,
        setCurrentSong,
    } = context;

    const handleNextSong = () => {
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
    };

    const handlePrevSong = () => {
        if (isRandom) {
            let indexRandom;
            do {
                indexRandom = Math.floor(Math.random() * songList.length);
            } while (indexRandom === currentSong.index);
            setCurrentSong(songList[indexRandom]);
        } else {
            if (currentSong.index !== 0) {
                setCurrentSong(songList[currentSong.index - 1]);
            } else {
                setCurrentSong(songList[songList.length - 1]);
            }
        }
    };

    const handlePlayPauseClick = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <div className={cx('control')}>
            {hideRepeat || (
                <div
                    className={cx('btn', 'btn-repeat', {
                        active: isRepeat,
                    })}
                    onClick={() => setIsRepeat(!isRepeat)}
                >
                    <FaUndo />
                </div>
            )}
            {hidePrev || (
                <div className={cx('btn', 'btn-prev')} onClick={handlePrevSong}>
                    <FaStepBackward />
                </div>
            )}
            <div className={cx('btn', 'btn-toggle-play')} onClick={handlePlayPauseClick}>
                {isPlaying ? <FaPause /> : <FaPlay />}
            </div>
            {hideNext || (
                <div className={cx('btn', 'btn-next')} onClick={handleNextSong}>
                    <FaStepForward />
                </div>
            )}
            {hideRandom || (
                <div
                    className={cx('btn', 'btn-random', {
                        active: isRandom,
                    })}
                    onClick={() => setIsRandom(!isRandom)}
                >
                    <FaRandom />
                </div>
            )}
        </div>
    );
}

export default memo(Control);
