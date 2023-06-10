import classNames from 'classnames/bind';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import styles from './App.module.scss';
import Dashboard from './pages/Dashboard/Dashboard';
import Home from './pages/Home/Home';
import { useCallback, useRef } from 'react';
import Audio from './components/Audio/Audio';

const cx = classNames.bind(styles);

function App() {
    console.log('app');

    const audioRef = useRef();

    const handleProgressChange = useCallback((e) => {
        const audio = audioRef.current;
        const seekTime = (audio.duration / 100) * e.target.value;
        audio.currentTime = seekTime;
    }, []);

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
