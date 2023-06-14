import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';

import { ImLoop } from 'react-icons/im';
import { FiDownload } from 'react-icons/fi';
import {
    FaArrowLeft,
    FaBars,
    FaHeart,
    FaPause,
    FaPlay,
    FaRandom,
    FaRegHeart,
    FaStepBackward,
    FaStepForward,
} from 'react-icons/fa';

import styles from './Dashboard.module.scss';
import { CD, Progress } from '~/components';
import { useAppContext } from '~/AppContext/hooks';

const cx = classNames.bind(styles);

function Dashboard({ handleProgressChange, getTime }) {
    const {
        songList,
        currentSong,
        isPlaying,
        isRandom,
        isRepeat,
        setCurrentSong,
        setIsPlaying,
        setIsRandom,
        setIsRepeat,
    } = useAppContext();

    const [isFavoriteSong, setIsFavoriteSong] = useState(currentSong.isFavorite);

    const navigate = useNavigate();

    // Press Space Toggle Play/Pause
    useEffect(() => {
        const handleKeyDownSpace = (e) => {
            if (e.keyCode === 32) {
                e.preventDefault();
                setIsPlaying((prev) => !prev);
            }
        };

        document.addEventListener('keydown', handleKeyDownSpace);

        return () => {
            document.removeEventListener('keydown', handleKeyDownSpace);
        };
    }, [setIsPlaying]);

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

    const handleClickHeart = () => {
        setIsFavoriteSong(!isFavoriteSong);
        const favoriteSongList = JSON.parse(localStorage.getItem('favoriteList')) || [];

        const isSongInFavoriteList = favoriteSongList.some((favoriteSong) => favoriteSong.id === currentSong.id);

        if (isSongInFavoriteList) {
            songList[currentSong.index].isFavorite = false;
            currentSong.isFavorite = false;
            const updatedFavoriteList = favoriteSongList.filter((favoriteSong) => favoriteSong.id !== currentSong.id);
            localStorage.setItem('favoriteList', JSON.stringify(updatedFavoriteList));
        } else {
            songList[currentSong.index].isFavorite = true;
            currentSong.isFavorite = true;
            favoriteSongList.push(currentSong);
            localStorage.setItem('favoriteList', JSON.stringify(favoriteSongList));
        }
    };

    const handleClickDownload = () => {
        fetch(currentSong.url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Lỗi khi tải xuống bài hát.');
                }
                return response.blob();
            })
            .then((blob) => {
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = currentSong.name;

                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className={cx('dashboard')}>
            <div className={cx('header')}>
                <div
                    className={cx('btn', 'back-icon')}
                    onClick={() => {
                        navigate('/');
                    }}
                >
                    <FaArrowLeft className={cx('icon')} />
                </div>

                <h3 className={cx('title')}>Now Playing</h3>

                <div className={cx('btn', 'bars-icon')}>
                    <FaBars className={cx('icon')} />
                </div>
            </div>

            <div className={cx('cd')}>
                <CD thumbnailM={currentSong.thumbnailM} isPlaying={isPlaying} />
            </div>

            <div className={cx('current-song')}>
                <h2>{currentSong.name}</h2>
                <h4>{currentSong.artistsNames}</h4>
            </div>

            <div className={cx('other')}>
                <div className={cx('wrap')}>
                    <div className={cx('btn')} onClick={handleClickHeart}>
                        {isFavoriteSong ? (
                            <FaHeart className={cx('heart-icon')} />
                        ) : (
                            <FaRegHeart className={cx('heart-icon')} />
                        )}
                    </div>
                    <div className={cx('btn', 'download-btn')} onClick={handleClickDownload}>
                        <FiDownload className={cx('download-icon')} />
                    </div>
                </div>

                <div className={cx('wrap')}>
                    <div
                        className={cx('btn', {
                            active: isRepeat,
                        })}
                        onClick={() => {
                            if (isRandom && !isRepeat) setIsRandom(false);
                            setIsRepeat(!isRepeat);
                        }}
                    >
                        <ImLoop className={cx('repeat-icon')} />
                    </div>

                    <div
                        className={cx('btn', {
                            active: isRandom,
                        })}
                        onClick={() => {
                            if (isRepeat && !isRandom) setIsRepeat(false);
                            setIsRandom(!isRandom);
                        }}
                    >
                        <FaRandom className={cx('random-icon')} />
                    </div>
                </div>
            </div>

            <Progress handleProgressChange={handleProgressChange} getTime={getTime} />

            <div className={cx('control')}>
                <div className={cx('btn', 'btn-prev')} onClick={handlePrevSong}>
                    <FaStepBackward />
                </div>
                <div className={cx('btn-toggle-play')} onClick={handlePlayPauseClick}>
                    {isPlaying ? <FaPause /> : <FaPlay />}
                </div>
                <div className={cx('btn', 'btn-next')}>
                    <FaStepForward onClick={handleNextSong} />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
