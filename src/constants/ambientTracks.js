export const AMBIENT_TRACK_IDS = ['rain', 'ocean', 'watermello'];

export const AMBIENT_TRACK_SRC = {
  rain: '/cozyrain.mp3',
  ocean: '/ocean.mp3',
  watermello: '/watermellolofi.mp3',
};

export const AMBIENT_TRACK_LABEL = {
  rain: 'Rain',
  ocean: 'Ocean',
  watermello: 'Watermello Lofi',
};

/**
 * Keep layers a/b/c on distinct tracks; the layer that changed keeps its pick.
 */
export function ensureUniqueTracks(tracks, fixedLayer) {
  const all = AMBIENT_TRACK_IDS;
  const result = { ...tracks };
  const used = new Set();
  used.add(result[fixedLayer]);

  for (const key of ['a', 'b', 'c']) {
    if (key === fixedLayer) continue;
    if (used.has(result[key])) {
      const pick = all.find((id) => !used.has(id));
      if (pick) result[key] = pick;
    }
    used.add(result[key]);
  }
  return result;
}
