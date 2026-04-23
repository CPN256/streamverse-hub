import { useEffect, useState } from "react";
import { Search, Sparkles, TrendingUp, Trophy, Tv, Calendar, Loader2, Star } from "lucide-react";
import { anime, type AnimeItem } from "@/lib/davidcyril";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Mode = "trending" | "top" | "airing" | "season";

const MODES: { id: Mode; label: string; icon: any }[] = [
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "top", label: "Top Ranked", icon: Trophy },
  { id: "airing", label: "Airing Now", icon: Tv },
  { id: "season", label: "This Season", icon: Calendar },
];

export const AnimeHub = () => {
  const [mode, setMode] = useState<Mode>("trending");
  const [items, setItems] = useState<AnimeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<AnimeItem | null>(null);

  const load = async (m: Mode) => {
    setLoading(true);
    try {
      const fn =
        m === "trending" ? anime.trending : m === "top" ? anime.top : m === "airing" ? anime.airing : anime.season;
      const data: any = await fn();
      setItems(data.results || []);
    } catch {
      toast.error("Anime feed unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(mode); }, [mode]);

  const search = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data: any = await anime.search(query.trim());
      setItems(data.results || []);
      if (!data.results?.length) toast.info("No anime found.");
    } catch {
      toast.error("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="animate-float-up">
      <h1 className="mb-2 font-display text-4xl font-black tracking-wide">
        Anime <span className="text-gradient">Universe</span>
      </h1>
      <p className="mb-8 text-muted-foreground flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        Live data from MAL & AniList via the David Cyril grid.
      </p>

      <form onSubmit={search} className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any anime…"
            className="w-full rounded-full border border-border bg-muted/60 py-3 pl-11 pr-4 text-sm outline-none focus:border-primary focus:shadow-glow"
          />
        </div>
        <button type="submit" className="rounded-full bg-gradient-primary px-6 text-sm font-semibold text-primary-foreground shadow-glow">
          Search
        </button>
      </form>

      <div className="mb-8 flex flex-wrap gap-2">
        {MODES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setQuery(""); setMode(id); }}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm transition-smooth",
              mode === id && !query
                ? "border-primary bg-primary text-primary-foreground shadow-glow"
                : "border-border bg-muted/40 hover:border-primary"
            )}
          >
            <Icon className="h-3.5 w-3.5" /> {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">No anime found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelected(a)}
              className="group overflow-hidden rounded-2xl border border-border bg-gradient-card text-left shadow-card transition-smooth hover:border-primary hover:shadow-glow"
            >
              <div className="relative aspect-[2/3] overflow-hidden">
                <img src={a.image} alt={a.title} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                {a.score != null && (
                  <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 text-xs font-bold backdrop-blur">
                    <Star className="h-3 w-3 text-secondary" /> {a.score}
                  </span>
                )}
                {a.rank && (
                  <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">
                    #{a.rank}
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="truncate font-semibold text-sm">{a.title_english || a.title}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {a.type || "Anime"} {a.episodes ? `• ${a.episodes} ep` : ""} {a.year ? `• ${a.year}` : ""}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div onClick={() => setSelected(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md">
          <div onClick={(e) => e.stopPropagation()} className="max-h-[85vh] max-w-2xl overflow-auto rounded-3xl border border-primary bg-gradient-card p-6 shadow-glow">
            <div className="flex flex-col gap-4 md:flex-row">
              <img src={selected.image} alt={selected.title} className="w-full rounded-2xl md:w-48" />
              <div className="flex-1">
                <h2 className="font-display text-2xl font-black">{selected.title_english || selected.title}</h2>
                {selected.title_english && selected.title !== selected.title_english && (
                  <p className="text-sm text-muted-foreground">{selected.title}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {selected.type && <span className="rounded-full bg-primary/20 px-2 py-1 text-primary">{selected.type}</span>}
                  {selected.status && <span className="rounded-full bg-muted px-2 py-1">{selected.status}</span>}
                  {selected.episodes && <span className="rounded-full bg-muted px-2 py-1">{selected.episodes} episodes</span>}
                  {selected.score && <span className="rounded-full bg-secondary/20 px-2 py-1 text-secondary">★ {selected.score}</span>}
                </div>
                {selected.genres && selected.genres.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {selected.genres.map((g) => (
                      <span key={g} className="rounded-full border border-border px-2 py-0.5 text-xs">{g}</span>
                    ))}
                  </div>
                )}
                {selected.synopsis && <p className="mt-4 text-sm text-muted-foreground">{selected.synopsis}</p>}
                <button onClick={() => setSelected(null)} className="mt-6 rounded-full bg-gradient-primary px-6 py-2 text-sm font-semibold text-primary-foreground">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};