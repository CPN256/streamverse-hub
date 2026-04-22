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
  const res = await fetch("https://api.tvmaze.com/shows?page=0");
  const data = await res.json();
  return data
    .map(mapShow)
    .filter((s: Show | null): s is Show => !!s)
    .sort((a: Show, b: Show) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 60);
}

export async function searchShows(q: string): Promise<Show[]> {
  const res = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(q)}`);
  const data = await res.json();
  return data
    .map((d: any) => mapShow(d.show))
    .filter((s: Show | null): s is Show => !!s);
}