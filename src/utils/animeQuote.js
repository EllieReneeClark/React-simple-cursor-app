const ANIMECHAN_RANDOM_URL = 'https://api.animechan.io/v1/quotes/random';
const FETCH_TIMEOUT_MS = 12_000;

function normalizePayload(data) {
  if (!data || typeof data !== 'object') return null;
  if (data.status === 'success' && data.data && typeof data.data === 'object') {
    const d = data.data;
    const quote = d.content;
    const anime = d.anime && d.anime.name;
    const character = d.character && d.character.name;
    if (
      typeof quote === 'string' &&
      typeof character === 'string' &&
      typeof anime === 'string'
    ) {
      return { quote, character, anime };
    }
  }
  return null;
}

/** Random quote from Animechan API, or `null` on failure. */
export async function fetchRandomAnimeQuote() {
  if (typeof fetch !== 'function') return null;
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(ANIMECHAN_RANDOM_URL, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return normalizePayload(data);
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}
