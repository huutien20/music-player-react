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
        var songList = [];
        if (isFavorite) {
            songList = JSON.parse(localStorage.getItem('favoriteList'));
            if (songList) {
                songList = songList.map((song, index) => {
                    return {
                        ...song,
                        index: index,
                    };
                });
                setSongList(songList);
            } else {
                setSongList([]);
            }
        } else {
            songList = JSON.parse(localStorage.getItem('songList'));
            if (songList) {
                setSongList(songList);
            } else {
                const apiGetSongList = async () => {
                    try {
                        const res = await axios.get('https://api-zingmp3-vercel.vercel.app/api/charthome');
                        const listId = res.data.data.RTChart.items;

                        const songPromises = listId.map((item) => {
                            try {
                                const song = {
                                    id: item.encodeId,
                                    name: item.title,
                                    artistsNames: item.artistsNames,
                                    thumbnail: item.thumbnail,
                                    thumbnailM: item.thumbnailM,
                                };
                                return axios
                                    .get(`https://api-zingmp3-vercel.vercel.app/api/song`, {
                                        params: {
                                            id: item.encodeId,
                                        },
                                    })
                                    .then((res) => {
                                        const data = res.data.data;
                                        if (data) {
                                            return { ...song, url: data[128] };
                                        }
                                        return null;
                                    });
                            } catch (error) {
                                return null;
                            }
                        });
                        const songs = await Promise.all(songPromises);
                        const filteredListSongs = songs.filter((song) => song !== null);
                        const listSongs = filteredListSongs.map((song, index) => {
                            return {
                                ...song,
                                index: index,
                            };
                        });
                        setSongList(listSongs);
                        localStorage.setItem('songList', JSON.stringify(listSongs));
                    } catch (error) {
                        console.log(error);
                    }
                };
                apiGetSongList();
            }
        }
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
