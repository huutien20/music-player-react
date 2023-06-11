import classNames from 'classnames/bind';
import { FaArrowLeft, FaBars, FaHeart } from 'react-icons/fa';

import styles from './Header.module.scss';
import { Search } from './Search';
import { images } from '~/assets/images';
import { useAppContext } from '~/AppContext/hooks';

const cx = classNames.bind(styles);

function Header() {
    const { songList, isFavorite, setIsFavorite } = useAppContext();
    return (
        <header className={cx('wrapper')}>
            <div className={cx('header')}>
                <div
                    className={cx('btn', 'favorite-btn')}
                    onClick={() => {
                        setIsFavorite(!isFavorite);
                    }}
                >
                    {isFavorite ? <FaArrowLeft className={cx('icon')} /> : <FaHeart className={cx('icon')} />}
                </div>

                <Search />

                <div className={cx('btn', 'bars-btn')}>
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
