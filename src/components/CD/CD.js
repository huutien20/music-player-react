import classNames from 'classnames/bind';
import styles from './CD.module.scss';
import { forwardRef, memo } from 'react';

const cx = classNames.bind(styles);

const CD = forwardRef(({ thumbnailM, isPlaying }, ref) => {
    console.log('cd');
    return (
        <div ref={ref} className={cx('cd')}>
            <div
                id="cd-thumb"
                className={cx('cd-thumb', {
                    playing: isPlaying,
                })}
                style={{ backgroundImage: `url(${thumbnailM})` }}
            ></div>
        </div>
    );
});

export default memo(CD);
