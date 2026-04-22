export interface Show {
  id: number;
  name: string;
  image: string;
  rating: number | null;
  year: string;
  genres: string[];
  summary: string;
  language: string;
  status: string;
  network: string;
  officialSite: string | null;
  imdbId: string | null;
  url: string;
}

const stripHtml = (s: string | null) => (s ?? "").replace(/<[^>]+>/g, "");

// --- Cache layer ---------------------------------------------------------
// Two-tier cache: in-memory (per session) + localStorage (cross-visit).
// TTL keeps results fresh without hammering the TVMaze API.
const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours
const CACHE_PREFIX = "cpn-tvmaze:v1:";
const memCache = new Map<string, { ts: number; data: unknown }>();

function readCache<T>(key: string): T | null {
  const mem = memCache.get(key);
  if (mem && Date.now() - mem.ts < CACHE_TTL_MS) return mem.data as T;
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { ts: number; data: T };
    if (Date.now() - parsed.ts >= CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    memCache.set(key, parsed);
    return parsed.data;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, data: T) {
  const entry = { ts: Date.now(), data };
  memCache.set(key, entry);
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // storage full or unavailable — memory cache still works
  }
}

async function cachedFetchJson<T>(key: string, url: string): Promise<T> {
  const hit = readCache<T>(key);
  if (hit !== null) return hit;
  const res = await fetch(url);
  const data = (await res.json()) as T;
  writeCache(key, data);
  return data;
}

const mapShow = (raw: any): Show | null => {
  if (!raw?.image?.original && !raw?.image?.medium) return null;
  return {
    id: raw.id,
    name: raw.name,
    image: raw.image.original ?? raw.image.medium,
    rating: raw.rating?.average ?? null,
    year: raw.premiered ? raw.premiered.slice(0, 4) : "—",
    genres: raw.genres ?? [],
    summary: stripHtml(raw.summary),
    language: raw.language ?? "—",
    status: raw.status ?? "—",
    network: raw.network?.name ?? raw.webChannel?.name ?? "—",
    officialSite: raw.officialSite ?? null,
    imdbId: raw.externals?.imdb ?? null,
    url: raw.url,
  };
};

export async function fetchTrending(): Promise<Show[]> {
  const data = await cachedFetchJson<any[]>("trending:p0", "https://api.tvmaze.com/shows?page=0");
  return data
    .map(mapShow)
    .filter((s: Show | null): s is Show => !!s)
    .sort((a: Show, b: Show) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 60);
}

export async function searchShows(q: string): Promise<Show[]> {
  const key = `search:${q.trim().toLowerCase()}`;
  const data = await cachedFetchJson<any[]>(
    key,
    `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(q)}`
  );
  return data
    .map((d: any) => mapShow(d.show))
    .filter((s: Show | null): s is Show => !!s);
}