import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './SongItem.module.scss';
import { useAppContext } from '~/AppContext/hooks';

const cx = classNames.bind(styles);

function SongItem({ song, isSearch }) {
    const [isFavoriteSong, setIsFavoriteSong] = useState(song.isFavorite);
    const { songList, currentSong, setCurrentSong, setIsPlaying, isFavorite } = useAppContext();

    const songRef = useRef();
    const navigate = useNavigate();

    const handleSongClick = (e, song) => {
        const isOptionClicked = e.target.closest(`.${cx('option')}`);
        const isSongActive = songRef.current.classList.contains(cx('active'));

        if (isOptionClicked) {
            setIsFavoriteSong((prev) => !prev);
            const favoriteSongList = JSON.parse(localStorage.getItem('favoriteList')) || [];

            const isSongInFavoriteList = favoriteSongList.some((favoriteSong) => favoriteSong.id === song.id);

            if (isSongInFavoriteList) {
                if (isSongActive) currentSong.isFavorite = false;
                songList[song.index].isFavorite = false;
                const updatedFavoriteList = favoriteSongList.filter((favoriteSong) => favoriteSong.id !== song.id);
                localStorage.setItem('favoriteList', JSON.stringify(updatedFavoriteList));
            } else {
                if (isSongActive) currentSong.isFavorite = true;
                songList[song.index].isFavorite = true;
                favoriteSongList.push(song);
                localStorage.setItem('favoriteList', JSON.stringify(favoriteSongList));
            }
        } else if (songRef.current && !isSongActive) {
            const detailSong = isFavorite ? songList.find((s) => s.id === song.id) : song;
            setCurrentSong(detailSong);
            setIsPlaying(true);
            navigate(`dashboard/${song.id}`);
        }
    };

    useEffect(() => {
        if (songRef.current && songRef.current.classList.contains(cx('active'))) {
            songRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [currentSong?.id]);

    return (
        <div
            ref={songRef}
            className={cx('song', {
                active: song.id === currentSong.id,
            })}
            onClick={(e) => handleSongClick(e, song)}
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
