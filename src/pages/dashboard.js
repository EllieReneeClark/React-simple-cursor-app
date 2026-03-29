import {
  AMBIENT_TRACK_IDS,
  AMBIENT_TRACK_LABEL,
} from '../constants/ambientTracks';
import './dashboard.css';

function Dashboard({
  user,
  onSignOut,
  tracks,
  onLayerTrackChange,
  volumeA,
  volumeB,
  volumeC,
  onLayerVolumeChange,
  mutedA,
  mutedB,
  mutedC,
  onToggleLayerMute,
}) {
  const displayName = user?.displayName?.trim();
  const email = user?.email ?? '';

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
      <div className="DashboardLayout">
        <header className="DashboardHeader">
          <h1 className="DashboardTitle">Soothing Space</h1>
          <p className="DashboardTagline">
            Your personal space for soothing sounds
          </p>
        </header>

        <div className="DashboardCard">
          <h2>Your dashboard</h2>
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

          <fieldset className="AmbientSoundField">
            <legend className="AmbientSoundLegend">Ambient layers</legend>
            <p className="AmbientSoundHint">
              Up to three sounds can play together (one per layer). Each layer
              uses a different sound—changing a layer may adjust another so
              tracks stay unique.
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
                      {AMBIENT_TRACK_IDS.map((id) => (
                        <option key={id} value={id}>
                          {AMBIENT_TRACK_LABEL[id]}
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
