import classNames from 'classnames/bind';
import styles from './Progress.module.scss';
import { memo, useEffect, useState } from 'react';

const cx = classNames.bind(styles);

const Progress = ({ handleProgressChange, progressPercent, getTime }) => {
    console.log('progress');
    const [currTime, minuteSong, secondSong] = getTime();
    const [minute, setMinute] = useState('00');
    const [second, setSecond] = useState('00');
    useEffect(() => {
        setTimeout(() => {
            const minuteSong = Math.floor(currTime / 60);
            const secondSong = Math.floor(currTime - minuteSong * 60);
            setMinute(minuteSong.toString().padStart(2, '0'));
            setSecond(secondSong.toString().padStart(2, '0'));
        }, 1000);
    });

    return (
        <div className={cx('progress-bar')}>
            <input
                id="progress"
                className={cx('progress')}
                type="range"
                value={progressPercent}
                step="1"
                min="0"
                max="100"
                onChange={handleProgressChange}
            />
            <div style={{ width: `${progressPercent}%` }} className={cx('progress-value')}></div>
            <div className={cx('time')}>
                {/* <p>{`0${minute}:${second < 10 ? `0${second}` : second}`}</p> */}
                <p>{`${minute}:${second}`}</p>
                <p>{`0${minuteSong ? minuteSong : '0'}:${
                    secondSong < 10 ? `0${secondSong}` : secondSong ? secondSong : '00'
                }`}</p>
            </div>
        </div>
    );
};

export default memo(Progress);
