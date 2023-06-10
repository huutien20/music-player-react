import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import { memo, useEffect, useRef, useState } from 'react';
import SongItem from '~/components/SongItem/SongItem';

const cx = classNames.bind(styles);

function Search({ songList }) {
    console.log('search');
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [isFocus, setIsFocus] = useState(false);
    const [placeholder, setPlaceholder] = useState('');

    const inputRef = useRef();

    useEffect(() => {
        if (!!searchValue.trim()) {
            var result = [];

            songList.forEach((song) => {
                const value = searchValue.trim().toLowerCase();
                const matchName = song.name.toLowerCase().match(value);
                const matchArtistsNames = song.artistsNames.toLowerCase().match(value);
                if (matchName || matchArtistsNames) {
                    result.push(song);
                }
            });

            setSearchResult(result);
        } else {
            setSearchResult([]);
        }
    }, [searchValue, songList]);

    useEffect(() => {
        if (isFocus) {
            inputRef.current.focus();
        }
    }, [isFocus]);

    useEffect(() => {
        if (songList.length > 0) {
            const random = Math.floor(Math.random() * songList.length);
            setPlaceholder(songList[random].name);
        }
    }, [songList]);

    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('search')}>
                    <div className={cx('wrap-icon')}>
                        {isFocus && searchValue ? (
                            <FaArrowLeft className={cx('icon')} />
                        ) : (
                            <FaSearch className={cx('icon')} />
                        )}
                    </div>
                    <input
                        className={cx('search-input')}
                        type="text"
                        placeholder={placeholder}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onFocus={() => {
                            setIsFocus(true);
                        }}
                    />
                </div>
            </div>
            {isFocus && (
                <div className={cx('search-result')}>
                    <div className={cx('header-result')}>
                        <div className={cx('back-btn')}>
                            <FaArrowLeft className={cx('back-icon')} />
                        </div>
                        <div className={cx('wrap-input')}>
                            <input
                                className={cx('search-input')}
                                ref={inputRef}
                                type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onBlur={() => {
                                    setTimeout(() => {
                                        setIsFocus(false);
                                    }, 300);
                                }}
                            />
                        </div>
                    </div>
                    {searchResult.length > 0 ? (
                        <div className={cx('result-list')}>
                            {searchResult.map((song) => (
                                <SongItem key={song.id} song={song} isSearch={true} />
                            ))}
                        </div>
                    ) : (
                        <h4 className={cx('result-title')}>Không có kết quả tìm kiếm</h4>
                    )}
                </div>
            )}
        </>
    );
}

export default memo(Search);
