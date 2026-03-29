export const AMBIENT_TRACK_IDS = [
  'rain',
  'ocean',
  'thunderstorm',
  'blizzard',
  'waterdrip',
  'watermello',
  'untouchable',
  'valiant',
];

export const AMBIENT_TRACK_SRC = {
  rain: '/cozyrain.mp3',
  ocean: '/ocean.mp3',
  watermello: '/watermellolofi.mp3',
  untouchable: '/Untouchable.mp3',
  valiant: '/Valor.mp3',
  thunderstorm: '/thunderstorm.mp3',
  blizzard: '/Blizzard.mp3',
  waterdrip: '/WaterDrip.mp3',
};

export const AMBIENT_TRACK_LABEL = {
  rain: 'Rain',
  ocean: 'Ocean',
  watermello: 'Watermello',
  untouchable: 'Untouchable',
  valiant: 'Valiant',
  thunderstorm: 'Thunderstorm',
  blizzard: 'Blizzard',
  waterdrip: 'Dripping Water',
};

/**
 * Keep layers a/b/c on distinct tracks; the layer that changed keeps its pick.
 */
export function ensureUniqueTracks(
  tracks,
  fixedLayer,
  availableTrackIds = AMBIENT_TRACK_IDS
) {
  const all = availableTrackIds;
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
