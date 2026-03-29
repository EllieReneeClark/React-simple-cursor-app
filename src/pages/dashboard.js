import { useEffect, useRef, useState } from 'react';
import './dashboard.css';

const DASHBOARD_UI_IDLE_MS = 20000;

function Dashboard({
  user,
  onSignOut,
  tracks,
  trackOptions,
  onLayerTrackChange,
  volumeA,
  volumeB,
  volumeC,
  onLayerVolumeChange,
  mutedA,
  mutedB,
  mutedC,
  onToggleLayerMute,
  backgroundOptions,
  selectedBackgroundId,
  onBackgroundChange,
}) {
  const displayName = user?.displayName?.trim();
  const email = user?.email ?? '';
  const [uiHidden, setUiHidden] = useState(false);
  const idleTimerRef = useRef(null);

  useEffect(() => {
    const resetIdleTimer = () => {
      setUiHidden(false);
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      idleTimerRef.current = setTimeout(() => {
        setUiHidden(true);
      }, DASHBOARD_UI_IDLE_MS);
    };

    const eventNames = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'wheel',
    ];

    eventNames.forEach((eventName) =>
      window.addEventListener(eventName, resetIdleTimer)
    );
    resetIdleTimer();

    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      eventNames.forEach((eventName) =>
        window.removeEventListener(eventName, resetIdleTimer)
      );
    };
  }, []);

  const layers = [
    {
      key: 'a',
      title: 'Layer 1',
      track: tracks.a,
      volume: volumeA,
      muted: mutedA,
      volId: 'layer-a-vol',
      trackId: 'layer-a-track',
    },
    {
      key: 'b',
      title: 'Layer 2',
      track: tracks.b,
      volume: volumeB,
      muted: mutedB,
      volId: 'layer-b-vol',
      trackId: 'layer-b-track',
    },
    {
      key: 'c',
      title: 'Layer 3',
      track: tracks.c,
      volume: volumeC,
      muted: mutedC,
      volId: 'layer-c-vol',
      trackId: 'layer-c-track',
    },
  ];

  return (
    <div className="DashboardPage">
      <div
        className={`DashboardLayout ${uiHidden ? 'DashboardLayout--hidden' : ''}`}
      >
        <header className="DashboardHeader">
          <h1 className="DashboardTitle">Soothing Space</h1>
          <p className="DashboardTagline">
            Your personal space for soothing sounds
          </p>
        </header>

        <div className="DashboardCard">
          <div className="DashboardIntro">
            <h2 className="DashboardIntroTitle">Your dashboard</h2>
            <p className="DashboardWelcome">
              {displayName
                ? `Welcome back, ${displayName}.`
                : 'Welcome back.'}
            </p>
            {email && (
              <p className="DashboardEmail">
                Signed in as <strong>{email}</strong>
              </p>
            )}
          </div>

          <div className="DashboardMainRow">
            <div className="DashboardColumn">
              <fieldset className="AmbientSoundField">
                <legend className="AmbientSoundLegend">Ambient layers</legend>
                <p className="AmbientSoundHint">
                  Layers start silent—raise volume on any layer to hear it. Up
                  to three sounds can play together (one per layer). Changing a
                  layer may adjust another so tracks stay unique.
                </p>

                {layers.map(
                  ({
                    key,
                    title,
                    track,
                    volume,
                    muted,
                    volId,
                    trackId,
                  }) => (
                    <div className="SoundLayer" key={key}>
                      <div className="SoundLayerHeader">
                        <label className="SoundLayerTitle" htmlFor={trackId}>
                          {title}
                        </label>
                        <select
                          id={trackId}
                          className="SoundLayerSelect"
                          value={track}
                          onChange={(e) =>
                            onLayerTrackChange(key, e.target.value)
                          }
                        >
                          {trackOptions.map(({ id, label }) => (
                            <option key={id} value={id}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="SoundLayerControls">
                        <button
                          type="button"
                          className="SoundLayerMute"
                          onClick={() => onToggleLayerMute(key)}
                        >
                          {muted ? 'Unmute' : 'Mute'}
                        </button>
                        <label
                          className="SoundLayerVolLabel"
                          htmlFor={volId}
                        >
                          Volume
                        </label>
                        <input
                          id={volId}
                          className="SoundLayerSlider"
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={volume}
                          onChange={(e) =>
                            onLayerVolumeChange(key, e.target.value)
                          }
                        />
                      </div>
                    </div>
                  )
                )}
              </fieldset>

              <fieldset className="AmbientSoundField">
                <legend className="AmbientSoundLegend">Background</legend>
                <p className="AmbientSoundHint">
                  Choose the looping background video for your space.
                </p>
                <select
                  className="SoundLayerSelect SoundLayerSelect--full"
                  value={selectedBackgroundId}
                  onChange={(e) => onBackgroundChange(e.target.value)}
                >
                  {backgroundOptions.map(({ id, label }) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
              </fieldset>
            </div>
          </div>

          <button
            type="button"
            className="DashboardSignOut"
            onClick={onSignOut}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
