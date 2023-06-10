import classNames from 'classnames/bind';
import styles from './SongItem.module.scss';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '~/AppContext/AppContext';

const cx = classNames.bind(styles);

function SongItem({ song, isSearch }) {
    console.log('song item');
    const [isFavoriteSong, setIsFavoriteSong] = useState(false);

    const navigate = useNavigate();
    const context = useContext(AppContext);
    const { songList, currentSong, setCurrentSong, setIsPlaying, isFavorite } = context;
    const songRef = useRef();

    useEffect(() => {
        const favoriteSongList = JSON.parse(localStorage.getItem('favoriteList'));
        if (favoriteSongList) {
            setIsFavoriteSong(!!favoriteSongList.find((favoriteSong) => song.id === favoriteSong.id));
        }
    }, [song.id]);

    const handleSongClick = (e, song) => {
        const songNode = songRef.current;
        if (e.target.closest(`.${cx('option')}`)) {
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
        } else if (songNode && !songNode.classList.contains(cx('active'))) {
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
