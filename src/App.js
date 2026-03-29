import './App.css';
import { useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  AMBIENT_TRACK_SRC,
  ensureUniqueTracks,
} from './constants/ambientTracks';
import { auth } from './firebase';
import Dashboard from './pages/dashboard';
import LoginPage from './pages/login';
import SignupPage from './pages/Signup';

function tryPlayAudioElement(el) {
  if (!el || process.env.NODE_ENV === 'test') {
    return;
  }
  try {
    const playPromise = el.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  } catch {
    // Ignore environments where media playback is not implemented.
  }
}

function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(() => Boolean(auth));

  const [tracks, setTracks] = useState({
    a: 'rain',
    b: 'ocean',
    c: 'watermello',
  });
  const [volumeA, setVolumeA] = useState(0.3);
  const [volumeB, setVolumeB] = useState(0.3);
  const [volumeC, setVolumeC] = useState(0.3);
  const [mutedA, setMutedA] = useState(false);
  const [mutedB, setMutedB] = useState(false);
  const [mutedC, setMutedC] = useState(false);

  const audioRefA = useRef(null);
  const audioRefB = useRef(null);
  const audioRefC = useRef(null);

  /** Default cozy rain on login/signup only (separate from dashboard layers). */
  const [guestRainVolume, setGuestRainVolume] = useState(0.4);
  const [guestRainMuted, setGuestRainMuted] = useState(false);
  const guestRainRef = useRef(null);

  useEffect(() => {
    if (!auth) {
      setUser(null);
      setAuthLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
    }
    setPage('login');
  };

  const handleLayerTrackChange = (layer, newId) => {
    setTracks((prev) => {
      const next = { ...prev, [layer]: newId };
      return ensureUniqueTracks(next, layer);
    });
  };

  const toggleMuteLayer = (layer) => {
    if (layer === 'a') {
      setMutedA((m) => !m);
    } else if (layer === 'b') {
      setMutedB((m) => !m);
    } else {
      setMutedC((m) => !m);
    }
  };

  const handleVolumeLayer = (layer, value) => {
    const v = Number(value);
    if (layer === 'a') {
      setVolumeA(v);
      if (v > 0) {
        setMutedA(false);
      }
    } else if (layer === 'b') {
      setVolumeB(v);
      if (v > 0) {
        setMutedB(false);
      }
    } else {
      setVolumeC(v);
      if (v > 0) {
        setMutedC(false);
      }
    }
  };

  useEffect(() => {
    const el = audioRefA.current;
    if (!el) {
      return;
    }
    el.volume = volumeA;
    el.muted = mutedA;
    tryPlayAudioElement(el);
  }, [volumeA, mutedA, tracks.a]);

  useEffect(() => {
    const el = audioRefB.current;
    if (!el) {
      return;
    }
    el.volume = volumeB;
    el.muted = mutedB;
    tryPlayAudioElement(el);
  }, [volumeB, mutedB, tracks.b]);

  useEffect(() => {
    const el = audioRefC.current;
    if (!el) {
      return;
    }
    el.volume = volumeC;
    el.muted = mutedC;
    tryPlayAudioElement(el);
  }, [volumeC, mutedC, tracks.c]);

  useEffect(() => {
    const el = guestRainRef.current;
    if (!el) {
      return;
    }
    el.volume = guestRainVolume;
    el.muted = guestRainMuted;
    tryPlayAudioElement(el);
  }, [guestRainVolume, guestRainMuted]);

  const toggleGuestRainMute = () => {
    const next = !guestRainMuted;
    setGuestRainMuted(next);
    if (guestRainRef.current) {
      guestRainRef.current.muted = next;
      tryPlayAudioElement(guestRainRef.current);
    }
  };

  const handleGuestRainVolume = (e) => {
    const v = Number(e.target.value);
    setGuestRainVolume(v);
    if (v > 0) {
      setGuestRainMuted(false);
    }
    if (guestRainRef.current) {
      guestRainRef.current.volume = v;
      if (v > 0 && guestRainRef.current.muted) {
        guestRainRef.current.muted = false;
      }
      tryPlayAudioElement(guestRainRef.current);
    }
  };

  const showGuestRain = !user && !authLoading;

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

      {/* Ambient audio only while signed in — unmount on logout so playback stops */}
      {user ? (
        <>
          <audio
            ref={audioRefA}
            key={tracks.a}
            autoPlay
            loop
            muted={mutedA}
            aria-hidden="true"
          >
            <source src={AMBIENT_TRACK_SRC[tracks.a]} type="audio/mpeg" />
          </audio>
          <audio
            ref={audioRefB}
            key={tracks.b}
            autoPlay
            loop
            muted={mutedB}
            aria-hidden="true"
          >
            <source src={AMBIENT_TRACK_SRC[tracks.b]} type="audio/mpeg" />
          </audio>
          <audio
            ref={audioRefC}
            key={tracks.c}
            autoPlay
            loop
            muted={mutedC}
            aria-hidden="true"
          >
            <source src={AMBIENT_TRACK_SRC[tracks.c]} type="audio/mpeg" />
          </audio>
        </>
      ) : null}

      {showGuestRain ? (
        <>
          <audio
            ref={guestRainRef}
            autoPlay
            loop
            muted={guestRainMuted}
            aria-hidden="true"
          >
            <source
              src={AMBIENT_TRACK_SRC.rain}
              type="audio/mpeg"
            />
          </audio>
          <div className="GuestAudioControls">
            <span className="GuestAudioTitle">Cozy rain</span>
            <button
              type="button"
              className="GuestAudioMute"
              onClick={toggleGuestRainMute}
            >
              {guestRainMuted ? 'Unmute' : 'Mute'}
            </button>
            <label className="GuestAudioVolLabel" htmlFor="guest-rain-volume">
              Volume
            </label>
            <input
              id="guest-rain-volume"
              className="GuestAudioSlider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={guestRainVolume}
              onChange={handleGuestRainVolume}
            />
          </div>
        </>
      ) : null}

      <div
        key={user ? 'dashboard' : page}
        className="PageContent"
      >
        {authLoading ? (
          <div className="AuthLoading" role="status">
            Loading…
          </div>
        ) : user ? (
          <Dashboard
            user={user}
            onSignOut={handleSignOut}
            tracks={tracks}
            onLayerTrackChange={handleLayerTrackChange}
            volumeA={volumeA}
            volumeB={volumeB}
            volumeC={volumeC}
            onLayerVolumeChange={handleVolumeLayer}
            mutedA={mutedA}
            mutedB={mutedB}
            mutedC={mutedC}
            onToggleLayerMute={toggleMuteLayer}
          />
        ) : page === 'signup' ? (
          <SignupPage onNavigateToLogin={() => setPage('login')} />
        ) : (
          <LoginPage onNavigateToSignup={() => setPage('signup')} />
        )}
      </div>
    </div>
  );
}

export default App;
