import { useEffect, useMemo, useState } from "react";
import { Search, Heart, Home, LayoutDashboard, Film, Flame, Tv2, Trophy, Eye, Sparkles, Music, Download, Tv, Clapperboard } from "lucide-react";
import { fetchTrending, searchShows, type Show } from "@/lib/tvmaze";
import { MediaCard } from "@/components/MediaCard";
import { DetailModal } from "@/components/DetailModal";
import { Chatbot } from "@/components/Chatbot";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Splash } from "@/components/Splash";
import { MusicHub } from "@/components/MusicHub";
import { Downloader } from "@/components/Downloader";
import { AnimeHub } from "@/components/AnimeHub";
import { MoviesHub } from "@/components/MoviesHub";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Tab = "home" | "dashboard" | "favorites" | "music" | "download" | "anime" | "movies";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [tab, setTab] = useState<Tab>("home");
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState<string>("All");
  const [selected, setSelected] = useState<Show | null>(null);
  const { favorites, toggle, isFav } = useFavorites();
  const [viewed, setViewed] = useState<Show[]>([]);

  useEffect(() => {
    fetchTrending()
      .then((s) => setShows(s))
      .catch(() => toast.error("Failed to load library — check your connection."))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setActiveGenre("All");
    try {
      const r = await searchShows(query);
      setShows(r);
      if (!r.length) toast.info("No matches — try another title.");
    } finally {
      setLoading(false);
    }
  };

  const resetLibrary = async () => {
    setQuery("");
    setLoading(true);
    setShows(await fetchTrending());
    setLoading(false);
  };

  const genres = useMemo(() => {
    const set = new Set<string>();
    shows.forEach((s) => s.genres.forEach((g) => set.add(g)));
    return ["All", ...Array.from(set).slice(0, 12)];
  }, [shows]);

  const filtered = useMemo(
    () => (activeGenre === "All" ? shows : shows.filter((s) => s.genres.includes(activeGenre))),
    [shows, activeGenre]
  );

  const openDetail = (s: Show) => {
    setSelected(s);
    setViewed((prev) => [s, ...prev.filter((p) => p.id !== s.id)].slice(0, 8));
  };

  return (
    <div className="min-h-screen pb-32 scrollbar-cyber">
      {showSplash && (
        <Splash
          onDone={() => {
            setShowSplash(false);
          }}
        />
      )}
      {/* Decorative bg */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, hsl(var(--primary)/0.25) 0%, transparent 45%), radial-gradient(circle at 85% 80%, hsl(var(--secondary)/0.2) 0%, transparent 45%)",
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-primary/40 bg-background/70 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-4 md:px-8">
          <button
            onClick={() => { setTab("home"); resetLibrary(); }}
            className="font-display text-xl font-black tracking-widest text-gradient md:text-2xl"
          >
            CPN MOVIES <span className="text-secondary">2030</span>
          </button>

          <form onSubmit={handleSearch} className="order-3 flex-1 md:order-2 md:max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the cyber library…"
                className="w-full rounded-full border border-border bg-muted/60 py-2.5 pl-11 pr-24 text-sm outline-none transition-smooth focus:border-primary focus:shadow-glow"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-gradient-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground"
              >
                Search
              </button>
            </div>
          </form>

          <nav className="order-2 ml-auto flex items-center gap-1 md:order-3">
            {[
              { id: "home" as const, icon: Home, label: "Home" },
              { id: "anime" as const, icon: Tv, label: "Anime" },
              { id: "music" as const, icon: Music, label: "Music" },
              { id: "download" as const, icon: Download, label: "Get" },
              { id: "dashboard" as const, icon: LayoutDashboard, label: "Stats" },
              { id: "favorites" as const, icon: Heart, label: "Favs" },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-smooth",
                  tab === id ? "bg-primary text-primary-foreground shadow-glow" : "hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Status bar */}
        <div className="border-t border-border/60 bg-background/40">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-2 text-xs text-muted-foreground md:px-8">
            <span className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[hsl(135_100%_50%)] animate-pulse-dot" />
              Stream-X Grid: <span className="text-foreground">Online</span>
            </span>
            <span className="flex items-center gap-1.5"><Film className="h-3 w-3" /> {shows.length} titles loaded</span>
            <span className="flex items-center gap-1.5"><Tv2 className="h-3 w-3" /> Posters via TVMaze</span>
            <span className="flex items-center gap-1.5"><Sparkles className="h-3 w-3" /> AI assistant ready</span>
          </div>
        </div>
      </header>

      <ThemeSwitcher />

      <main className="mx-auto max-w-7xl px-4 pt-8 md:px-8">
        {tab === "home" && (
          <section className="animate-float-up">
            {/* Hero */}
            <div className="mb-10 rounded-3xl border border-primary/40 bg-gradient-card p-8 shadow-card md:p-12">
              <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
                <Flame className="h-3 w-3" /> NEON GRID • 2030 EDITION
              </p>
              <h1 className="font-display text-4xl font-black leading-tight tracking-wide md:text-6xl">
                Stream the <span className="text-gradient">future</span>.
                <br />
                Discover the <span className="text-gradient">classics</span>.
              </h1>
              <p className="mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
                A live library powered by the open TVMaze grid. Real posters, ratings, and links — wrapped in a neon hub.
              </p>
            </div>

            {/* Genre tabs */}
            <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold">
              <Film className="h-5 w-5 text-primary" /> Browse by Genre
            </h2>
            <div className="mb-8 flex flex-wrap gap-2">
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => setActiveGenre(g)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm transition-smooth",
                    activeGenre === g
                      ? "border-primary bg-primary text-primary-foreground shadow-glow"
                      : "border-border bg-muted/40 hover:border-primary"
                  )}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="aspect-[2/3] animate-pulse rounded-2xl bg-muted/40" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <p className="py-20 text-center text-muted-foreground">No results. Try another search.</p>
            ) : (
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filtered.map((s) => (
                  <MediaCard key={s.id} show={s} isFav={isFav(s.id)} onToggleFav={toggle} onOpen={openDetail} />
                ))}
              </div>
            )}
          </section>
        )}

        {tab === "dashboard" && (
          <section className="animate-float-up">
            <h1 className="mb-2 font-display text-4xl font-black tracking-wide">
              Your <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="mb-8 text-muted-foreground">A snapshot of your CPN activity.</p>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { icon: Eye, label: "Titles Viewed", value: viewed.length },
                { icon: Heart, label: "Favorites", value: favorites.length },
                { icon: Trophy, label: "Level", value: Math.max(1, Math.floor((viewed.length + favorites.length) / 5) + 1) },
                { icon: Flame, label: "Streak", value: viewed.length > 0 ? 1 : 0 },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-2xl border border-primary/40 bg-gradient-card p-5 text-center shadow-card">
                  <Icon className="mx-auto mb-2 h-7 w-7 text-primary" />
                  <div className="font-display text-3xl font-black text-gradient">{value}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>

            <h2 className="mb-4 mt-10 flex items-center gap-2 font-display text-xl font-bold">
              <Eye className="h-5 w-5 text-primary" /> Recently Viewed
            </h2>
            {viewed.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
                Open any title to start your history.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-5">
                {viewed.map((s) => (
                  <MediaCard key={s.id} show={s} isFav={isFav(s.id)} onToggleFav={toggle} onOpen={openDetail} />
                ))}
              </div>
            )}
          </section>
        )}

        {tab === "favorites" && (
          <section className="animate-float-up">
            <h1 className="mb-2 font-display text-4xl font-black tracking-wide">
              My <span className="text-gradient">Favorites</span>
            </h1>
            <p className="mb-8 text-muted-foreground">Everything you've hearted, in one neon shelf.</p>

            {favorites.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center">
                <Heart className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">No favorites yet. Tap the heart on any poster to save it.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {favorites.map((s) => (
                  <MediaCard key={s.id} show={s} isFav onToggleFav={toggle} onOpen={openDetail} />
                ))}
              </div>
            )}
          </section>
        )}

        {tab === "music" && <MusicHub />}
        {tab === "download" && <Downloader />}
        {tab === "anime" && <AnimeHub />}
      </main>

      <footer className="mt-16 border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        CPN Movies 2030 — neon streaming hub • Data via the open TVMaze grid
      </footer>

      <DetailModal
        show={selected}
        onClose={() => setSelected(null)}
        isFav={selected ? isFav(selected.id) : false}
        onToggleFav={toggle}
      />
      <Chatbot />
    </div>
  );
};

export default Index;
