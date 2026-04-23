// Lightweight client for the David Cyril API (https://apis.davidcyril.name.ng)
// All endpoints are public — no auth required.

const BASE = "https://apis.davidcyril.name.ng";

async function call<T = any>(path: string, params: Record<string, string> = {}): Promise<T> {
  const qs = new URLSearchParams(params).toString();
  const url = `${BASE}${path}${qs ? `?${qs}` : ""}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`API ${r.status}`);
  return r.json();
}

/* ---------- Downloaders ---------- */
export const dl = {
  ytmp3: (url: string) => call("/download/ytmp3", { url }),
  ytmp4: (url: string) => call("/download/ytmp4", { url }),
  facebook: (url: string) => call("/facebook", { url }),
  instagram: (url: string) => call("/instagram", { url }),
  tiktok: (url: string) => call("/download/tiktok", { url }),
  twitter: (url: string) => call("/twitter", { url }),
  spotify: (url: string) => call("/spotifydl", { url }),
  song: (url: string) => call("/song", { url }),
  apk: (text: string) => call("/download/apk", { text }),
  website: (url: string) => call("/tools/downloadweb", { url }),
  drive: (url: string) => call("/gdrive", { url }),
  mediafire: (url: string) => call("/mediafire", { url }),
  aio: (url: string) => call("/download/aio", { url }),
};

/* ---------- Anime ---------- */
export interface AnimeItem {
  id: number;
  title: string;
  title_english?: string | null;
  type?: string;
  episodes?: number | null;
  status?: string;
  score?: number | null;
  year?: number | null;
  image: string;
  synopsis?: string;
  rank?: number;
  latest_episode?: number;
  genres?: string[];
}

export const anime = {
  search: (q: string) => call<{ results: AnimeItem[] }>("/anime/search", { q }),
  trending: () => call<{ results: AnimeItem[] }>("/anime/trending"),
  top: () => call<{ results: AnimeItem[] }>("/anime/top"),
  airing: () => call<{ results: AnimeItem[] }>("/anime/airing"),
  season: () => call<{ results: AnimeItem[] }>("/anime/season"),
  schedule: () => call<{ results: AnimeItem[] }>("/anime/schedule"),
  info: (id: string | number) => call("/anime/info", { id: String(id) }),
  episodes: (id: string | number) => call("/anime/episodes", { id: String(id) }),
  characters: (id: string | number) => call("/anime/characters", { id: String(id) }),
};

/* ---------- Subtitles ---------- */
export const subtitles = {
  subdlSearch: (q: string) => call("/subdl/search", { q }),
  subdlInfo: (id: string) => call("/subdl/info", { id }),
  subttSearch: (q: string) => call("/subttsearch/search", { q }),
};

export const API_BASE = BASE;