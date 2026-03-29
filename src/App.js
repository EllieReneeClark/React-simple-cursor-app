import './App.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  AMBIENT_TRACK_IDS,
  AMBIENT_TRACK_LABEL,
  AMBIENT_TRACK_SRC,
  ensureUniqueTracks,
} from './constants/ambientTracks';
import { auth } from './firebase';
import Dashboard from './pages/dashboard';
import LoginPage from './pages/login';
import SignupPage from './pages/Signup';

const DEFAULT_BACKGROUND = {
  id: 'default',
  label: 'Safe haven',
  src: '/loginscreenvideo.mp4',
};

const STARGAZER_BACKGROUND = {
  id: 'stargazer',
  label: 'Stargazer',
  src: '/LofiwithCat.mp4',
};

const SEEN_BACKGROUND = {
  id: 'seen',
  label: 'Seen',
  src: '/Iseeyou.mp4',
};

const UNCERTAINTY_BACKGROUND = {
  id: 'uncertainty',
  label: 'Uncertainty',
  src: '/Cantfaceme.mp4',
};

const FORGOTTEN_BACKGROUND = {
  id: 'forgotten',
  label: 'Forgotten',
  src: '/untouched.mp4',
};

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
  const [selectedBackgroundId, setSelectedBackgroundId] = useState(
    DEFAULT_BACKGROUND.id
  );

  const [tracks, setTracks] = useState({
    a: 'rain',
    b: 'ocean',
    c: 'watermello',
  });
  const [volumeA, setVolumeA] = useState(0);
  const [volumeB, setVolumeB] = useState(0);
  const [volumeC, setVolumeC] = useState(0);
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

  const trackOptions = useMemo(
    () =>
      AMBIENT_TRACK_IDS.map((id) => ({
        id,
        label: AMBIENT_TRACK_LABEL[id],
        src: AMBIENT_TRACK_SRC[id],
      })),
    []
  );
  const trackSrcById = useMemo(
    () =>
      trackOptions.reduce((acc, option) => {
        acc[option.id] = option.src;
        return acc;
      }, {}),
    [trackOptions]
  );
  const availableTrackIds = useMemo(
    () => trackOptions.map((option) => option.id),
    [trackOptions]
  );

  const backgroundOptions = useMemo(
    () => [
      DEFAULT_BACKGROUND,
      STARGAZER_BACKGROUND,
      SEEN_BACKGROUND,
      UNCERTAINTY_BACKGROUND,
      FORGOTTEN_BACKGROUND,
    ],
    []
  );
  const backgroundSrcById = useMemo(
    () =>
      backgroundOptions.reduce((acc, option) => {
        acc[option.id] = option.src;
        return acc;
      }, {}),
    [backgroundOptions]
  );

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

  useEffect(() => {
    setTracks((prev) => {
      const next = { ...prev };
      const fallbackId = availableTrackIds[0];
      if (!fallbackId) {
        return next;
      }
      for (const layer of ['a', 'b', 'c']) {
        if (!availableTrackIds.includes(next[layer])) {
          next[layer] = fallbackId;
        }
      }
      return ensureUniqueTracks(next, 'a', availableTrackIds);
    });
  }, [availableTrackIds]);

  useEffect(() => {
    if (!backgroundSrcById[selectedBackgroundId]) {
      setSelectedBackgroundId(DEFAULT_BACKGROUND.id);
    }
  }, [backgroundSrcById, selectedBackgroundId, DEFAULT_BACKGROUND.id]);

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
    }
    setPage('login');
  };

  const handleLayerTrackChange = (layer, newId) => {
    setTracks((prev) => {
      const next = { ...prev, [layer]: newId };
      return ensureUniqueTracks(next, layer, availableTrackIds);
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
  const backgroundVideoSrc = user
    ? backgroundSrcById[selectedBackgroundId] || DEFAULT_BACKGROUND.src
    : DEFAULT_BACKGROUND.src;

  return (
    <div className="App">
      <video
        key={backgroundVideoSrc}
        className="AppBackgroundVideo"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src={backgroundVideoSrc} type="video/mp4" />
      </video>
      <div className="AppBackgroundOverlay" aria-hidden="true" />

      {/* Ambient audio only while signed in — unmount on logout so playback stops */}
      {user ? (
        <>
          <audio
            ref={audioRefA}
            key={tracks.a}
            loop
            muted={mutedA}
            volume={volumeA}
            aria-hidden="true"
          >
            <source src={trackSrcById[tracks.a]} />
          </audio>
          <audio
            ref={audioRefB}
            key={tracks.b}
            loop
            muted={mutedB}
            volume={volumeB}
            aria-hidden="true"
          >
            <source src={trackSrcById[tracks.b]} />
          </audio>
          <audio
            ref={audioRefC}
            key={tracks.c}
            loop
            muted={mutedC}
            volume={volumeC}
            aria-hidden="true"
          >
            <source src={trackSrcById[tracks.c]} />
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
            trackOptions={trackOptions.map(({ id, label }) => ({
              id,
              label,
            }))}
            backgroundOptions={backgroundOptions.map(({ id, label }) => ({
              id,
              label,
            }))}
            selectedBackgroundId={selectedBackgroundId}
            onBackgroundChange={setSelectedBackgroundId}
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
