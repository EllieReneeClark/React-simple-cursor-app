import './App.css';
import { useEffect, useRef, useState } from 'react';
import LoginPage from './pages/login';
import SignupPage from './pages/Signup';

function App() {
  const [page, setPage] = useState('login');
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const audioRef = useRef(null);

  const tryPlayAudio = () => {
    if (!audioRef.current) {
      return;
    }

    if (process.env.NODE_ENV === 'test') {
      return;
    }

    try {
      const playPromise = audioRef.current.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Ignore autoplay policy errors until a user interaction occurs.
        });
      }
    } catch {
      // Ignore environments where media playback is not implemented.
    }
  };

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.volume = volume;
    audioRef.current.muted = isMuted;

    // Keep audio playing after user interactions that change controls.
    tryPlayAudio();
  }, [isMuted, volume]);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
      tryPlayAudio();
    }
  };

  const handleVolumeChange = (e) => {
    const nextVolume = Number(e.target.value);
    setVolume(nextVolume);

    // Unmute automatically when user drags volume above 0.
    if (nextVolume > 0 && isMuted) {
      setIsMuted(false);
    }

    if (audioRef.current) {
      audioRef.current.volume = nextVolume;
      if (nextVolume > 0 && audioRef.current.muted) {
        audioRef.current.muted = false;
      }
      tryPlayAudio();
    }
  };

  return (
    <div className="App">
      <video
        className="AppBackgroundVideo"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/loginscreenvideo.mp4" type="video/mp4" />
      </video>
      <div className="AppBackgroundOverlay" aria-hidden="true" />
      <audio ref={audioRef} autoPlay loop muted={isMuted}>
        <source src="/cozyrain.mp3" type="audio/mpeg" />
      </audio>

      <div key={page} className="PageContent">
        {page === 'login' ? (
          <LoginPage onNavigateToSignup={() => setPage('signup')} />
        ) : (
          <SignupPage onNavigateToLogin={() => setPage('login')} />
        )}
      </div>

      <div className="AudioControls">
        <button type="button" className="AudioButton" onClick={toggleMute}>
          {isMuted ? 'Unmute Rain' : 'Mute Rain'}
        </button>

        <label className="AudioLabel" htmlFor="rain-volume">
          Volume
        </label>
        <input
          id="rain-volume"
          className="AudioSlider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
}

export default App;
