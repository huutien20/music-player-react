import { memo } from 'react';
import classNames from 'classnames/bind';
import styles from './CD.module.scss';

const cx = classNames.bind(styles);

const CD = ({ thumbnailM, isPlaying }) => {
    return (
        <div className={cx('cd')}>
            <div
                id="cd-thumb"
                className={cx('cd-thumb', {
                    playing: isPlaying,
                })}
                style={{ backgroundImage: `url(${thumbnailM})` }}
            ></div>
        </div>
    );
};

export default memo(CD);
