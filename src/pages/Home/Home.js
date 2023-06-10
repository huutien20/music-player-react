import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Header from '~/components/Header/Header';
import { useContext, useEffect } from 'react';
import { AppContext } from '~/AppContext/AppContext';
import axios from 'axios';
import Control from '~/components/Control/Control';
import CD from '~/components/CD/CD';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SongItem from '~/components/SongItem/SongItem';

const cx = classNames.bind(styles);

function Home() {
    console.log('home');
    const navigate = useNavigate();
    const context = useContext(AppContext);
    const { songList, currentSong, isPlaying, setIsPlaying, setSongList, setCurrentSong, isFavorite } = context;

    // getSongList
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

    useEffect(() => {
        const removeLocalStorage = () => {
            localStorage.removeItem('songList');
        };
        window.addEventListener('beforeunload', removeLocalStorage);

        return () => {
            window.removeEventListener('beforeunload', removeLocalStorage);
        };
    }, []);

    return (
        <>
            <Header />

            <div className={cx('playlist')}>
                {songList.length > 0 && songList.map((song) => <SongItem key={song.id} song={song} />)}
            </div>
            {currentSong.id && (
                <div
                    className={cx('current-song')}
                    onClick={(e) => {
                        if (!e.target.closest(`.${cx('option')}`)) {
                            navigate(`/dashboard/${currentSong.id}`);
                        }
                    }}
                >
                    <div className={cx('thumbnail')}>
                        <CD thumbnailM={currentSong.thumbnailM} isPlaying={isPlaying} />
                    </div>
                    <div className={cx('body')}>
                        <h4 className={cx('name')}>{`${currentSong.name} (${currentSong.artistsNames})`}</h4>
                    </div>
                    <div className={cx('option')}>
                        <Control hideRandom={true} hideRepeat={true} hideNext={true} hidePrev={true} />
                        <div
                            className={cx('close')}
                            onClick={() => {
                                setCurrentSong({});
                                setIsPlaying(false);
                            }}
                        >
                            <FaTimes />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Home;
