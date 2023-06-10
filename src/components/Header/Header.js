import classNames from 'classnames/bind';
import { FaArrowLeft, FaBars, FaHeart } from 'react-icons/fa';

import styles from './Header.module.scss';
import images from '~/assets/images/images';
import { useContext } from 'react';
import { AppContext } from '~/AppContext/AppContext';
import Search from './Search/Search';

const cx = classNames.bind(styles);

function Header() {
    console.log('header');
    const context = useContext(AppContext);
    const { songList, isFavorite, setIsFavorite } = context;
    return (
        <header className={cx('wrapper')}>
            <div className={cx('header')}>
                <div
                    className={cx('wrap-icon')}
                    onClick={() => {
                        setIsFavorite(!isFavorite);
                    }}
                >
                    {isFavorite ? <FaArrowLeft className={cx('icon')} /> : <FaHeart className={cx('icon')} />}
                </div>

                <Search songList={songList} />

                <div className={cx('wrap-icon')}>
                    <FaBars className={cx('icon')} />
                </div>
            </div>

            <div className={cx('banner')}>
                <img src={images.banner} alt="banner" />
                <h4 className={cx('title')}>{isFavorite ? 'Danh Sách Bài Hát Yêu Thích' : 'Top 100 Nhạc Trẻ'}</h4>
                <p>{`${songList.length ? songList.length : '0'} bài hát ${
                    isFavorite ? 'yêu thích' : '- bởi Zing MP3'
                }`}</p>
            </div>
        </header>
    );
}

export default Header;
