import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPause, FaPlay, FaTimes } from 'react-icons/fa';
import classNames from 'classnames/bind';

import styles from './Home.module.scss';
import { Header, CD, SongItem } from '~/components';
import { useAppContext } from '~/AppContext/hooks';

const cx = classNames.bind(styles);

function Home() {
    const navigate = useNavigate();
    const { songList, currentSong, isPlaying, setIsPlaying, setSongList, setCurrentSong, isFavorite } = useAppContext();

    // Load Song List
    useEffect(() => {
        const loadSongList = async () => {
            let songList = [];

            if (isFavorite) {
                const favoriteList = JSON.parse(localStorage.getItem('favoriteList')) || [];
                songList = favoriteList.map((song, index) => ({
                    ...song,
                    index,
                    isFavorite: true,
                }));
            } else {
                songList = JSON.parse(localStorage.getItem('songList'));
                const favoriteList = JSON.parse(localStorage.getItem('favoriteList'));

                if (songList) {
                    songList = songList.map((song) => {
                        return {
                            ...song,
                            isFavorite:
                                favoriteList && !!favoriteList.find((favoriteSong) => favoriteSong.id === song.id),
                        };
                    });
                } else {
                    try {
                        const res = await axios.get('https://api-zingmp3-vercel.vercel.app/api/charthome');
                        const listId = res.data.data.RTChart.items;

                        const songPromises = listId.map(async (item) => {
                            try {
                                const song = {
                                    id: item.encodeId,
                                    name: item.title,
                                    artistsNames: item.artistsNames,
                                    thumbnail: item.thumbnail,
                                    thumbnailM: item.thumbnailM,
                                    isFavorite:
                                        favoriteList &&
                                        !!favoriteList.find((favoriteSong) => favoriteSong.id === item.encodeId),
                                };

                                const songRes = await axios.get(`https://api-zingmp3-vercel.vercel.app/api/song`, {
                                    params: { id: item.encodeId },
                                });

                                const data = songRes.data.data;
                                if (data) {
                                    return { ...song, url: data[128] };
                                }

                                return null;
                            } catch (error) {
                                return null;
                            }
                        });

                        const songs = await Promise.all(songPromises);
                        const filteredSongs = songs.filter((song) => song !== null);

                        songList = filteredSongs.map((song, index) => ({
                            ...song,
                            index,
                        }));

                        localStorage.setItem('songList', JSON.stringify(songList));
                    } catch (error) {
                        console.log(error);
                    }
                }
            }

            setSongList(songList);
        };

        loadSongList();
    }, [isFavorite, setSongList]);

    // Remove Song List In Local Storage
    useEffect(() => {
        const removeLocalStorage = () => {
            localStorage.removeItem('songList');
        };
        window.addEventListener('beforeunload', removeLocalStorage);

        return () => {
            window.removeEventListener('beforeunload', removeLocalStorage);
        };
    }, []);

    const handleClickDashboardSong = (e) => {
        if (!e.target.closest(`.${cx('option')}`)) {
            navigate(`/dashboard/${currentSong.id}`);
        }
    };

    const handleClickCloseBtn = () => {
        setCurrentSong({});
        setIsPlaying(false);
    };

    return (
        <>
            <Header />

            <div className={cx('playlist')}>
                {songList.length > 0
                    ? songList.map((song) => <SongItem key={song.id} song={song} />)
                    : !isFavorite && <div className={cx('loading')}>Đang tải danh sách bài hát...</div>}
            </div>

            {currentSong.id && (
                <div className={cx('dashboard-current-song')} onClick={handleClickDashboardSong}>
                    <div className={cx('thumbnail')}>
                        <CD thumbnailM={currentSong.thumbnailM} isPlaying={isPlaying} />
                    </div>

                    <div className={cx('body')}>
                        <h4 className={cx('name')}>{`${currentSong.name} (${currentSong.artistsNames})`}</h4>
                    </div>

                    <div className={cx('option')}>
                        <div className={cx('toggle-play-btn')} onClick={() => setIsPlaying((prev) => !prev)}>
                            {isPlaying ? <FaPause /> : <FaPlay />}
                        </div>

                        <div className={cx('close-btn')} onClick={handleClickCloseBtn}>
                            <FaTimes />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Home;
