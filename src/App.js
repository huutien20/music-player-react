import classNames from 'classnames/bind';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useRef } from 'react';

import styles from './App.module.scss';
import { Home, Dashboard } from '~/pages';
import { Audio } from '~/components';

const cx = classNames.bind(styles);

function App() {
    const audioRef = useRef();

    const handleProgressChange = (e) => {
        const audio = audioRef.current;
        const seekTime = (audio.duration / 100) * e.target.value;
        audio.currentTime = seekTime;
    };

    const getTime = () => {
        const audio = audioRef.current;
        const minuteSong = Math.floor(audio.duration / 60);
        const secondSong = Math.floor(audio.duration - minuteSong * 60);
        return [audio.currentTime, minuteSong, secondSong];
    };

    return (
        <Router>
            <div className={cx('App')}>
                <Routes>
                    <Route
                        path={'dashboard/:id'}
                        element={<Dashboard handleProgressChange={handleProgressChange} getTime={getTime} />}
                    />
                    <Route path={'/'} element={<Home />} />
                </Routes>
            </div>
            <Audio ref={audioRef} />
        </Router>
    );
}

export default App;
