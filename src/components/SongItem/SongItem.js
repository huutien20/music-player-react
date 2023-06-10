import classNames from 'classnames/bind';
import styles from './SongItem.module.scss';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '~/AppContext/AppContext';

const cx = classNames.bind(styles);

function SongItem({ song, isSearch }) {
    console.log('song item');
    const [isFavoriteSong, setIsFavoriteSong] = useState(false);

    const navigate = useNavigate();
    const context = useContext(AppContext);
    const { songList, currentSong, setCurrentSong, setIsPlaying, isFavorite } = context;

    useEffect(() => {
        const favoriteSongList = JSON.parse(localStorage.getItem('favoriteList'));
        if (favoriteSongList) {
            setIsFavoriteSong(!!favoriteSongList.find((favoriteSong) => song.id === favoriteSong.id));
        }
    }, [song.id]);

    const handleSongClick = (target, song) => {
        const songNode = target.closest(`.${cx('song')}:not(.${cx('active')})`);

        if (target.closest(`.${cx('option')}`)) {
            setIsFavoriteSong(!isFavoriteSong);
            const favoriteSongList = JSON.parse(localStorage.getItem('favoriteList'));
            if (favoriteSongList) {
                const check = favoriteSongList.find((favoriteSong) => favoriteSong.id === song.id);
                if (check) {
                    const result = favoriteSongList.filter((favoriteSong) => favoriteSong.id !== song.id);
                    localStorage.setItem('favoriteList', JSON.stringify(result));
                } else {
                    favoriteSongList.push(song);
                    localStorage.setItem('favoriteList', JSON.stringify(favoriteSongList));
                }
            } else {
                localStorage.setItem('favoriteList', JSON.stringify([song]));
            }
        } else {
            if (songNode) {
                if (isFavorite) {
                    const detailSong = songList.find((s) => s.id === song.id);
                    setCurrentSong(detailSong);
                    setIsPlaying(true);
                    navigate(`dashboard/${song.id}`);
                } else {
                    setCurrentSong(song);
                    setIsPlaying(true);
                    navigate(`dashboard/${song.id}`);
                }
            }
        }
    };
    useEffect(() => {
        const songActive = document.querySelector(`.${cx('song')}.${cx('active')}`);
        if (songActive) {
            setTimeout(() => {
                songActive.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }, 500);
        }
    }, [currentSong.id]);
    return (
        <div
            className={cx('song', {
                active: song.id === currentSong.id,
            })}
            onClick={(e) => handleSongClick(e.target, song)}
        >
            <div className={cx('thumb')} style={{ backgroundImage: `url(${song.thumbnail})` }}></div>
            <div className={cx('body')}>
                <h3 className={cx('title')}>{song.name}</h3>
                <p className={cx('author')}>{song.artistsNames}</p>
            </div>
            {!isSearch && (
                <div className={cx('option')}>
                    {isFavoriteSong ? (
                        <FaHeart className={cx('heart-active-icon')} />
                    ) : (
                        <FaRegHeart className={cx('heart-icon')} />
                    )}
                </div>
            )}
        </div>
    );
}

export default SongItem;
