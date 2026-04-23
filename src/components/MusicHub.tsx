import { useState } from "react";
import { Music, Search, Play, Pause, Download, ExternalLink, Disc3, Link2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { dl } from "@/lib/davidcyril";

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  artwork: string;
  preview: string;
  trackUrl: string;
}

export const MusicHub = () => {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState<number | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [mp3Url, setMp3Url] = useState("");
  const [mp3Loading, setMp3Loading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const search = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const r = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=24`
      );
      const data = await r.json();
      const mapped: Track[] = (data.results || []).map((t: any) => ({
        id: t.trackId,
        title: t.trackName,
        artist: t.artistName,
        album: t.collectionName || "—",
        artwork: (t.artworkUrl100 || "").replace("100x100", "400x400"),
        preview: t.previewUrl,
        trackUrl: t.trackViewUrl,
      }));
      setTracks(mapped);
      if (!mapped.length) toast.info("No tracks found.");
    } catch {
      toast.error("Music search failed.");
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = (t: Track) => {
    if (playing === t.id) {
      audio?.pause();
      setPlaying(null);
      return;
    }
    audio?.pause();
    const a = new Audio(t.preview);
    a.play().catch(() => toast.error("Preview unavailable."));
    a.onended = () => setPlaying(null);
    setAudio(a);
    setPlaying(t.id);
  };

  const download = async (t: Track) => {
    setDownloadingId(t.id);
    try {
      // The /song endpoint accepts a music URL — iTunes track URL works as a search reference.
      const res: any = await dl.song(t.trackUrl);
      const link =
        res?.result?.download_url || res?.DownloadLink || res?.result?.url || res?.url;
      if (link) {
        window.open(link, "_blank", "noopener");
        toast.success("Download started!");
      } else {
        toast.error("Couldn't fetch MP3 — try the URL downloader below.");
      }
    } catch {
      toast.error("Music download API unreachable.");
    } finally {
      setDownloadingId(null);
    }
  };

  const downloadByUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mp3Url.trim()) return toast.error("Paste a Spotify, YouTube, or song URL.");
    setMp3Loading(true);
    try {
      const isSpotify = mp3Url.toLowerCase().includes("spotify");
      const res: any = isSpotify ? await dl.spotify(mp3Url.trim()) : await dl.song(mp3Url.trim());
      const link = res?.DownloadLink || res?.result?.download_url || res?.result?.url;
      if (link) {
        window.open(link, "_blank", "noopener");
        toast.success(`MP3 ready: ${res?.title || "Track"}`);
      } else {
        toast.error(res?.message || "Couldn't extract MP3.");
      }
    } catch {
      toast.error("Music API failed.");
    } finally {
      setMp3Loading(false);
    }
  };

  return (
    <section className="animate-float-up">
      <h1 className="mb-2 font-display text-4xl font-black tracking-wide">
        Music <span className="text-gradient">Grid</span>
      </h1>
      <p className="mb-8 text-muted-foreground">
        Search 70M+ tracks via iTunes. Preview & download MP3 via the David Cyril grid.
      </p>

      <form onSubmit={search} className="mb-8 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Song, artist or album…"
            className="w-full rounded-full border border-border bg-muted/60 py-3 pl-11 pr-4 text-sm outline-none focus:border-primary focus:shadow-glow"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-gradient-primary px-6 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          Search
        </button>
      </form>

      <form onSubmit={downloadByUrl} className="mb-8 rounded-2xl border border-secondary/40 bg-gradient-card p-4 shadow-card">
        <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Link2 className="h-3.5 w-3.5" /> Direct MP3 download — paste a Spotify or YouTube link
        </label>
        <div className="flex gap-2">
          <input
            value={mp3Url}
            onChange={(e) => setMp3Url(e.target.value)}
            placeholder="https://open.spotify.com/track/…  or  https://youtu.be/…"
            className="flex-1 rounded-xl border border-border bg-muted/60 px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={mp3Loading}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
          >
            {mp3Loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            MP3
          </button>
        </div>
      </form>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-2xl bg-muted/40" />
          ))}
        </div>
      ) : tracks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          <Disc3 className="mx-auto mb-3 h-10 w-10" />
          Search for any song to begin.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {tracks.map((t) => (
            <div
              key={t.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-card shadow-card transition-smooth hover:border-primary hover:shadow-glow"
            >
              <div className="relative aspect-square">
                {t.artwork ? (
                  <img src={t.artwork} alt={t.title} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted">
                    <Music className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <button
                  onClick={() => togglePlay(t)}
                  className="absolute inset-0 flex items-center justify-center bg-background/0 opacity-0 transition-smooth group-hover:bg-background/60 group-hover:opacity-100"
                  aria-label="Play preview"
                >
                  <span className="rounded-full bg-primary p-4 text-primary-foreground shadow-glow">
                    {playing === t.id ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </span>
                </button>
                {playing === t.id && (
                  <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">
                    ▶ Playing
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="truncate font-semibold text-sm">{t.title}</p>
                <p className="truncate text-xs text-muted-foreground">{t.artist}</p>
                <div className="mt-2 flex gap-1.5">
                  <button
                    onClick={() => download(t)}
                    disabled={downloadingId === t.id}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary/20 px-2 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-smooth"
                  >
                    {downloadingId === t.id
                      ? <Loader2 className="h-3 w-3 animate-spin" />
                      : <Download className="h-3 w-3" />} Get
                  </button>
                  <a
                    href={t.trackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-lg bg-muted px-2 py-1.5 text-xs hover:bg-secondary hover:text-secondary-foreground transition-smooth"
                    aria-label="Open on iTunes"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};